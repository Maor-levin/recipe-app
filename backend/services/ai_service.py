import json
from openai import OpenAI
from loguru import logger
from core.config import settings
from typing import List, Dict


def get_client():
    """Get or create OpenRouter client"""
    try:
        logger.info(f"Creating OpenAI client with base_url=https://openrouter.ai/api/v1")
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.OPENROUTER_API_KEY,
        )
        logger.info("OpenAI client created successfully")
        return client
    except Exception as e:
        logger.error(f"Failed to create OpenAI client: {str(e)}", exc_info=True)
        raise


async def generate_recipe_variant(
    recipe_data: Dict,
    adjustments: List[str]
) -> Dict:
    """
    Generate a recipe variant using AI through OpenRouter
    
    Args:
        recipe_data: Original recipe with title, description, and blocks
        adjustments: List of adjustments like ["vegan", "gluten-free"]
    
    Returns:
        Dict with modified_title, modified_description, modified_blocks, changes_made
    """
    
    # Format the recipe blocks as readable text for AI
    formatted_recipe = format_recipe_blocks(recipe_data.get('recipe', []))
    
    # Build the prompt
    adjustments_str = ', '.join(adjustments)
    prompt = f"""Transform this recipe to be {adjustments_str}.

Original Recipe:
Title: {recipe_data.get('title', '')}
Description: {recipe_data.get('description', '')}

Recipe Content:
{formatted_recipe}

Requirements:
1. Make SPECIFIC ingredient substitutions with exact product names (no brand names) commonly available in Israel
2. Adjust cooking methods, temperatures, and timing if needed
3. Keep the same recipe structure with the same types of content blocks
4. Document all specific changes made with exact quantities and product names
5. Ensure the adjusted recipe is still practical and tasty

Substitution Guidelines (use products commonly available in Israel):
- Dairy-free: Use soy milk, oat milk, or almond milk. For butter, use dairy-free margarine. For cheese, use vegan cream cheese or vegan cheddar
- Gluten-free: Use gluten-free all-purpose flour or gluten-free flour blends. Specify the type (e.g., "gluten-free all-purpose flour", "gluten-free bread flour")
- Vegan: Replace eggs with aquafaba (chickpea water), flax eggs (1 tbsp ground flax + 3 tbsp water), or commercial egg replacers. Specify exact substitutes
- Sugar-free: Use stevia, erythritol, or xylitol - specify type and conversion ratio
- Nut-free: Replace with seeds (sunflower, pumpkin) or specify exact alternatives
- Low-carb/Keto: Use almond flour, coconut flour, or specify exact low-carb alternatives

Examples of GOOD substitutions:
- "Replace 200ml regular milk with 200ml soy milk"
- "Substitute 100g butter with 100g dairy-free margarine"
- "Replace 2 eggs with 2 tbsp ground flaxseed mixed with 6 tbsp water, let sit 5 minutes"
- "Use 250g gluten-free all-purpose flour instead of regular flour"

Examples of BAD substitutions (avoid):
- "Use a no dairy milk" ❌
- "Replace with plant-based alternative" ❌
- "Use gluten-free flour" ❌

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{{
  "modified_title": "adjusted title that mentions it's {adjustments_str}",
  "modified_description": "adjusted description explaining the modifications",
  "modified_blocks": [
    {{"type": "subtitle", "text": "section name"}},
    {{"type": "text", "text": "paragraph text"}},
    {{"type": "list", "items": ["item 1", "item 2"]}},
    {{"type": "image", "url": "keep original image URLs unchanged"}}
  ],
  "changes_made": ["Replaced 200ml regular milk with 200ml soy milk", "Changed butter to dairy-free margarine (100g)", ...]
}}

Important: 
- Be SPECIFIC with product names and exact quantities (no brand names)
- Use products commonly available in Israeli supermarkets (soy milk, margarine, gluten-free flour, etc.)
- Return ONLY the JSON object, no other text or formatting."""

    try:
        client = get_client()
        logger.info(f"Calling OpenRouter API with model: {settings.OPENROUTER_MODEL}")
        response = client.chat.completions.create(
            model=settings.OPENROUTER_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional Israeli chef and recipe developer with deep knowledge of products commonly available in Israeli supermarkets. You provide accurate, specific, and practical recipe modifications using exact product names (no brand names) that are commonly found in Israel. Always return valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,  # Lower temperature for more consistent, focused responses
            max_tokens=2500,  # Increased for more detailed responses
        )
        logger.info("OpenRouter API call completed successfully")
        
        # Extract and parse the response
        content = response.choices[0].message.content.strip()
        
        # Remove markdown code blocks if present
        if content.startswith("```"):
            # Remove ```json or ``` at start
            content = content.split('\n', 1)[1] if '\n' in content else content[3:]
            # Remove ``` at end
            content = content.rsplit('```', 1)[0] if '```' in content else content
            content = content.strip()
        
        result = json.loads(content)
        
        # Validate the response structure
        required_keys = ['modified_title', 'modified_description', 'modified_blocks', 'changes_made']
        if not all(key in result for key in required_keys):
            raise ValueError(f"AI response missing required keys. Got: {result.keys()}")
        
        return result
        
    except json.JSONDecodeError as e:
        raise Exception(f"AI returned invalid JSON: {str(e)}")
    except Exception as e:
        raise Exception(f"AI generation failed: {str(e)}")


def format_recipe_blocks(blocks: List[Dict]) -> str:
    """
    Format recipe blocks as readable text for AI input
    
    Args:
        blocks: List of recipe blocks (subtitle, text, list, image)
    
    Returns:
        Formatted string representation of the recipe
    """
    output = []
    
    for block in blocks:
        block_type = block.get('type', '')
        
        if block_type == 'subtitle':
            output.append(f"\n## {block.get('text', '')}\n")
            
        elif block_type == 'text':
            output.append(block.get('text', ''))
            
        elif block_type == 'list':
            items = block.get('items', [])
            for item in items:
                output.append(f"- {item}")
                
        elif block_type == 'image':
            output.append(f"[Image: {block.get('url', '')}]")
    
    return '\n'.join(output)
