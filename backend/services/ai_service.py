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
1. Make appropriate ingredient substitutions for {adjustments_str}
2. Adjust cooking methods if needed to accommodate the changes
3. Keep the same recipe structure with the same types of content blocks
4. Document all specific changes made
5. Ensure the adjusted recipe is still practical and tasty

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
  "changes_made": ["Replaced X with Y", "Changed method Z", ...]
}}

Important: Return ONLY the JSON object, no other text or formatting."""

    try:
        client = get_client()
        logger.info(f"Calling OpenRouter API with model: {settings.OPENROUTER_MODEL}")
        response = client.chat.completions.create(
            model=settings.OPENROUTER_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional chef and recipe developer. You provide accurate, safe, and delicious recipe modifications. Always return valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,  # Lower temperature for faster, more focused responses
            max_tokens=2000,  # Limit response size
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
