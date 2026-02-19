"""
API route definitions.
"""

from fastapi import APIRouter

from app.routes import packs, auth, users

api_router = APIRouter()

# Include route modules
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(packs.router, prefix="/packs", tags=["packs"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
