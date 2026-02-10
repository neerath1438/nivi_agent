"""Encryption service for securing API keys and credentials."""
import logging
from cryptography.fernet import Fernet
from app.config import settings

logger = logging.getLogger(__name__)


class EncryptionService:
    """Service for encrypting and decrypting sensitive data."""
    
    def __init__(self):
        """Initialize encryption service with key from settings."""
        try:
            self.cipher = Fernet(settings.encryption_key.encode())
        except Exception as e:
            logger.error(f"Failed to initialize encryption service: {str(e)}")
            raise ValueError("Invalid encryption key. Please check ENCRYPTION_KEY in .env")
    
    def encrypt(self, plain_text: str) -> str:
        """
        Encrypt plain text.
        
        Args:
            plain_text: The text to encrypt (e.g., API key)
            
        Returns:
            Encrypted text as a string
        """
        try:
            encrypted_bytes = self.cipher.encrypt(plain_text.encode())
            return encrypted_bytes.decode()
        except Exception as e:
            logger.error(f"Encryption failed: {str(e)}")
            raise ValueError("Failed to encrypt data")
    
    def decrypt(self, encrypted_text: str) -> str:
        """
        Decrypt encrypted text.
        
        Args:
            encrypted_text: The encrypted text to decrypt
            
        Returns:
            Decrypted plain text
        """
        try:
            decrypted_bytes = self.cipher.decrypt(encrypted_text.encode())
            return decrypted_bytes.decode()
        except Exception as e:
            logger.error(f"Decryption failed: {str(e)}")
            raise ValueError("Failed to decrypt data")


# Global encryption service instance
encryption_service = EncryptionService()
