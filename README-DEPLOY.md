# VideoNova backend setup

## Files
- `server/package.json`: Node.js dependencies and start command
- `server/index.js`: API endpoint for up to 3 generated scene images and one AI narration
- `server/.gitignore`: prevents local secrets and dependencies from being committed

## Deploy with Render
1. Upload the `server` folder into your existing GitHub repository, preserving the folder structure.
2. In Render, create **New + → Web Service** and connect the `videonova` repository.
3. Set **Root Directory** to `server`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `npm start`.
6. In Render Environment, add:
   - `OPENAI_API_KEY` = your secret OpenAI API key
   - `FRONTEND_ORIGIN` = `https://akashdiwate696-hue.github.io`
7. Deploy. Test `https://YOUR-RENDER-SERVICE.onrender.com/api/health`.

## API request
POST `/api/generate` with JSON:
{
  "story": "A story of at least 10 characters",
  "language": "Hindi",
  "scenes": [
    "A mysterious house at midnight",
    "A character discovers a clue"
  ]
}

Response contains `images` (data URLs), `audio` (MP3 data URL), and an AI voice disclosure.

## Important
- Image and speech API usage may incur charges. Check your account access and current pricing.
- Do not put API keys in frontend code or commit them to GitHub.
- The endpoint is rate-limited and allows up to 3 images per request, but production use should add user authentication, per-user quotas, billing controls, and persistent job/storage handling.
- This API generates assets, not a finished MP4. A separate video-rendering step is still needed.
