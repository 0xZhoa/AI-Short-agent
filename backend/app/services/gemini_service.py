import json
import logging
import google.generativeai as genai
from app.config import settings
from app.prompts.angle_prompt import get_angle_prompt
from app.prompts.script_prompt import get_script_prompt
from app.prompts.storyboard_prompt import get_storyboard_prompt
from app.prompts.metadata_prompt import get_metadata_prompt

logger = logging.getLogger("app.services.gemini_service")

def check_api_key():
    """Verify if the API key is configured and configure genai if present."""
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing. Please set GEMINI_API_KEY in backend/.env file.")
    genai.configure(api_key=api_key)

def call_gemini_json(prompt: str) -> any:
    """Helper function to call Gemini with a prompt and enforce a JSON response."""
    check_api_key()
    
    model = genai.GenerativeModel(settings.GEMINI_MODEL)
    
    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        if not response.text:
            raise ValueError("Empty response received from Gemini API.")
            
        data = json.loads(response.text.strip())
        return data
    except Exception as e:
        logger.error(f"Error calling Gemini API: {str(e)}")
        raise e

def generate_angles(project) -> list:
    """Generate 5 content angles for a project."""
    prompt = get_angle_prompt(
        topic=project.topic,
        niche=project.niche,
        language=project.language,
        platform=project.platform,
        duration=project.duration,
        style=project.style
    )
    
    result = call_gemini_json(prompt)
    if not isinstance(result, list):
        if isinstance(result, dict) and "angles" in result:
            result = result["angles"]
        else:
            result = [result]
            
    return result[:5]

def generate_script(project, selected_angle, word_count: int | None = None) -> str:
    """Generate script content for a project based on the selected angle."""
    prompt = get_script_prompt(
        topic=project.topic,
        language=project.language,
        platform=project.platform,
        duration=project.duration,
        style=project.style,
        angle_title=selected_angle.title,
        angle_hook=selected_angle.hook,
        angle_description=selected_angle.description,
        word_count=word_count
    )
    
    result = call_gemini_json(prompt)
    if isinstance(result, dict) and "content" in result:
        return result["content"]
    elif isinstance(result, str):
        return result
    else:
        return json.dumps(result)

def generate_storyboard(project, script, image_reference: str | None = None) -> list:
    """Generate storyboard scenes for a project based on the script."""
    prompt = get_storyboard_prompt(
        topic=project.topic,
        style=project.style,
        script_content=script.content,
        image_reference=image_reference
    )
    
    result = call_gemini_json(prompt)
    if not isinstance(result, list):
      if isinstance(result, dict) and "scenes" in result:
        result = result["scenes"]
      elif isinstance(result, dict) and "storyboard" in result:
        result = result["storyboard"]
      else:
        result = [result]
        
    return result

def generate_metadata(project, script, storyboard) -> dict:
    """Generate metadata (titles, description, tags, pinned comments) for a project."""
    storyboard_text = ""
    if storyboard:
        storyboard_text = "\n".join([
            f"Scene {s.scene_number} ({s.duration}): VO: {s.voice_over} | Visual: {s.visual}"
            for s in storyboard
        ])
        
    prompt = get_metadata_prompt(
        topic=project.topic,
        niche=project.niche,
        language=project.language,
        script_content=f"{script.content}\n\nStoryboard Summary:\n{storyboard_text}"
    )
    
    result = call_gemini_json(prompt)
    if not isinstance(result, dict):
        raise ValueError("Invalid metadata response format from Gemini. Expected an object.")
        
    return {
        "titles": result.get("titles", []),
        "description": result.get("description", ""),
        "tags": result.get("tags", []),
        "pinned_comments": result.get("pinned_comments", [])
    }
