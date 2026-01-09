# How to Deploy Your Anniversary Site to Vercel

Since your project is verified and built successfully, you can now make it live for the world (and your partner!) to see.

## Option 1: The Quickest Way (Vercel CLI)
This method uploads your files directly from your computer.

1.  **Open your Terminal** (PowerShell or Command Prompt) in the project folder.
2.  Run this command:
    ```powershell
    npx vercel
    ```
    *(If it asks to install 'vercel', type `y` and hit Enter)*

3.  **Follow the interactive prompts:**
    *   `Set up and deploy "ANIVERSARY"?` → Type **y** and Enter.
    *   `Which scope do you want to deploy to?` → Select your account (hit Enter).
    *   `Link to existing project?` → Type **n** and Enter.
    *   `What’s your project’s name?` → Hit Enter (or type a cool name).
    *   `In which directory is your code located?` → Hit Enter (for `./`).
    *   `Want to modify these settings?` → Type **n** and Enter.

4.  **Wait for the Magic!** 
    It will deploy and verify. Once done, it will show you a **Production** URL (e.g., `https://anniversary-love.vercel.app`).
    > **Click that link to see your live site!**

---

## Option 2: The "Pro" Way (GitHub Integration)
This is better if you want to make changes later and have them auto-deploy.

1.  **Create a Repo:** Go to GitHub and create a new repository.
2.  **Push Your Code:**
    Run these commands in your terminal:
    ```powershell
    git init
    git add .
    git commit -m "Ready for launch! 🚀"
    git branch -M main
    # Replace <URL> with your actual GitHub repo link
    git remote add origin <YOUR_GITHUB_REPO_URL>
    git push -u origin main
    ```
3.  **Connect to Vercel:**
    *   Go to [vercel.com/new](https://vercel.com/new).
    *   Select your GitHub repository.
    *   Click **Deploy**.

## ✅ Pre-Flight Check Passed
I already ran `npm run build` and your project compiled perfectly. All assets (music, videos, images) are ready to go.

### 💡 Tip for Mobile
When you share the link with your partner, it will work on their phone too! The design we built is responsive.
