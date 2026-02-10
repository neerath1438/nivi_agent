"""Credentials API endpoints for managing encrypted API keys."""
import logging
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.models import Credential, get_db
from app.services.encryption_service import encryption_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["credentials"])


# Pydantic schemas
class CredentialCreate(BaseModel):
    """Schema for creating a new credential."""
    name: str
    provider: str  # openai, gemini, claude, smtp
    value: str  # Plain text API key (will be encrypted)


class CredentialUpdate(BaseModel):
    """Schema for updating a credential."""
    name: str = None
    value: str = None  # Plain text API key (will be encrypted)


class CredentialResponse(BaseModel):
    """Schema for credential response (excludes encrypted value)."""
    id: int
    name: str
    provider: str
    created_at: datetime
    updated_at: datetime = None
    
    class Config:
        from_attributes = True


# Endpoints
@router.post("/credentials", response_model=CredentialResponse)
async def create_credential(credential: CredentialCreate, db: Session = Depends(get_db)):
    """Create a new encrypted credential."""
    try:
        # Encrypt the API key
        encrypted_value = encryption_service.encrypt(credential.value)
        
        # Create credential record
        db_credential = Credential(
            name=credential.name,
            provider=credential.provider,
            encrypted_value=encrypted_value
        )
        db.add(db_credential)
        db.commit()
        db.refresh(db_credential)
        
        logger.info(f"Credential created: {db_credential.id} ({db_credential.name})")
        return db_credential
        
    except ValueError as e:
        db.rollback()
        logger.error(f"Encryption error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating credential: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/credentials", response_model=List[CredentialResponse])
async def list_credentials(db: Session = Depends(get_db)):
    """Get all credentials (without encrypted values)."""
    try:
        credentials = db.query(Credential).order_by(Credential.created_at.desc()).all()
        return credentials
    except Exception as e:
        logger.error(f"Error listing credentials: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/credentials/{credential_id}", response_model=CredentialResponse)
async def get_credential(credential_id: int, db: Session = Depends(get_db)):
    """Get a specific credential by ID (without encrypted value)."""
    try:
        credential = db.query(Credential).filter(Credential.id == credential_id).first()
        if not credential:
            raise HTTPException(status_code=404, detail="Credential not found")
        return credential
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting credential: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/credentials/{credential_id}", response_model=CredentialResponse)
async def update_credential(
    credential_id: int, 
    credential_update: CredentialUpdate, 
    db: Session = Depends(get_db)
):
    """Update a credential."""
    try:
        db_credential = db.query(Credential).filter(Credential.id == credential_id).first()
        if not db_credential:
            raise HTTPException(status_code=404, detail="Credential not found")
        
        # Update name if provided
        if credential_update.name:
            db_credential.name = credential_update.name
        
        # Update and re-encrypt value if provided
        if credential_update.value:
            db_credential.encrypted_value = encryption_service.encrypt(credential_update.value)
        
        db_credential.updated_at = datetime.now()
        db.commit()
        db.refresh(db_credential)
        
        logger.info(f"Credential updated: {db_credential.id}")
        return db_credential
        
    except ValueError as e:
        db.rollback()
        logger.error(f"Encryption error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating credential: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/credentials/{credential_id}")
async def delete_credential(credential_id: int, db: Session = Depends(get_db)):
    """Delete a credential."""
    try:
        db_credential = db.query(Credential).filter(Credential.id == credential_id).first()
        if not db_credential:
            raise HTTPException(status_code=404, detail="Credential not found")
        
        db.delete(db_credential)
        db.commit()
        
        logger.info(f"Credential deleted: {credential_id}")
        return {"message": "Credential deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting credential: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
