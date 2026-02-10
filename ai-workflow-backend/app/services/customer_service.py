"""Customer service for WhatsApp bot tracking."""
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.customer import WhatsAppCustomer


class CustomerService:
    """Service for managing WhatsApp customer tracking."""
    
    @staticmethod
    def check_customer_exists(db: Session, phone_number: str) -> bool:
        """Check if customer already received link."""
        customer = db.query(WhatsAppCustomer).filter(
            WhatsAppCustomer.phone_number == phone_number
        ).first()
        
        if customer and customer.link_sent:
            return True
        return False
    
    @staticmethod
    def mark_link_sent(db: Session, phone_number: str, first_message: str = None, source: str = 'direct'):
        """Mark that link was sent to this customer."""
        customer = db.query(WhatsAppCustomer).filter(
            WhatsAppCustomer.phone_number == phone_number
        ).first()
        
        if customer:
            # Update existing customer
            customer.link_sent = True
            customer.sent_at = datetime.now()
            if first_message and not customer.first_message:
                customer.first_message = first_message
        else:
            # Create new customer record
            customer = WhatsAppCustomer(
                phone_number=phone_number,
                first_message=first_message,
                link_sent=True,
                sent_at=datetime.now(),
                source=source
            )
            db.add(customer)
        
        db.commit()
        return customer
    
    @staticmethod
    def get_customer_stats(db: Session):
        """Get statistics about customers."""
        total_customers = db.query(WhatsAppCustomer).count()
        links_sent = db.query(WhatsAppCustomer).filter(
            WhatsAppCustomer.link_sent == True
        ).count()
        
        return {
            "total_customers": total_customers,
            "links_sent": links_sent,
            "pending": total_customers - links_sent
        }
    
    @staticmethod
    def reset_customer(db: Session, phone_number: str):
        """Reset customer status (for testing or re-engagement)."""
        customer = db.query(WhatsAppCustomer).filter(
            WhatsAppCustomer.phone_number == phone_number
        ).first()
        
        if customer:
            customer.link_sent = False
            customer.sent_at = None
            db.commit()
            return True
        return False


# Global instance
customer_service = CustomerService()
