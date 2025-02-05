# Potion - AI-Powered Note Taking

Potion is an intelligent note-taking application that combines markdown syntax with AI capabilities for an enhanced writing experience.

## Key Features

- **AI-Powered Auto-completion**: Leverage GROQ API through Vercel AI SDK for smart content suggestions
- **AI-Generated Thumbnails**: Unique notebook thumbnails created via Hugging Face inference endpoints and stored using Supabase storage buckets
- **Markdown Editor**: Rich text editing powered by [TipTap](https://tiptap.dev/), providing a powerful and extensible WYSIWYG editor with full markdown support. Users can write and format notes using standard markdown syntax while seeing the formatted preview in real-time.
- **Secure Authentication**: User authentication powered by Clerk.js
- **Modern Architecture**: Built with Next.js App Router for optimal performance

## Tech Stack

The project is built using modern web technologies and AI services:

- **Frontend & Backend**: Next.js 15 with App Router architecture
- **Authentication**: Clerk.js for secure user management
- **Editor**: TipTap for markdown-based rich text editing
- **AI Services**: 
    - Hugging Face for image generation
    - GROQ for AI completions via Vercel AI SDK
- **Database & Storage**: Supabase for data and file storage
- **Deployment**: Vercel for hosting and serverless functions

## Getting Started

```bash
# Clone repository
git clone https://github.com/yourusername/potion.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example

# Start development server
npm run dev
```