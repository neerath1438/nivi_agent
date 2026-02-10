"""Check WhatsApp customers database."""
from app.models import get_db, WhatsAppCustomer
from sqlalchemy import text

def check_customers():
    """Display all customers in the database."""
    db = next(get_db())
    
    try:
        print("\n" + "="*80)
        print("📊 WHATSAPP CUSTOMERS DATABASE")
        print("="*80)
        
        # Get all customers
        customers = db.query(WhatsAppCustomer).all()
        
        if not customers:
            print("\n⚠️  No customers found in database!")
            print("\nDatabase is empty. Send a WhatsApp message to add a customer.\n")
            return
        
        print(f"\n✅ Total Customers: {len(customers)}\n")
        
        # Display each customer
        for i, customer in enumerate(customers, 1):
            print(f"Customer #{i}:")
            print(f"  📱 Phone Number: {customer.phone_number}")
            print(f"  💬 First Message: {customer.first_message}")
            print(f"  📤 Link Sent: {'✅ Yes' if customer.link_sent else '❌ No'}")
            print(f"  📍 Source: {customer.source}")
            print(f"  📅 Created: {customer.created_at}")
            print("-" * 80)
        
        print("\n" + "="*80)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        db.close()


def reset_customer(phone_number: str):
    """Reset a customer (delete from database)."""
    db = next(get_db())
    
    try:
        customer = db.query(WhatsAppCustomer).filter(
            WhatsAppCustomer.phone_number == phone_number
        ).first()
        
        if customer:
            db.delete(customer)
            db.commit()
            print(f"\n✅ Customer {phone_number} deleted from database!")
            print("They can now receive the catalog link again.\n")
        else:
            print(f"\n⚠️  Customer {phone_number} not found in database.\n")
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        db.close()


def clear_all_customers():
    """Clear all customers from database."""
    db = next(get_db())
    
    try:
        count = db.query(WhatsAppCustomer).count()
        
        if count == 0:
            print("\n⚠️  Database is already empty!\n")
            return
        
        # Confirm before deleting
        print(f"\n⚠️  WARNING: This will delete {count} customer(s) from database!")
        confirm = input("Type 'YES' to confirm: ")
        
        if confirm == "YES":
            db.query(WhatsAppCustomer).delete()
            db.commit()
            print(f"\n✅ Deleted {count} customer(s) from database!\n")
        else:
            print("\n❌ Cancelled. No customers deleted.\n")
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        db.close()


if __name__ == "__main__":
    import sys
    
    print("\n🔧 WhatsApp Customer Database Manager\n")
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "check":
            check_customers()
        
        elif command == "reset" and len(sys.argv) > 2:
            phone = sys.argv[2]
            reset_customer(phone)
        
        elif command == "clear":
            clear_all_customers()
        
        else:
            print("❌ Invalid command!")
            print("\nUsage:")
            print("  python check_customers.py check                    # View all customers")
            print("  python check_customers.py reset 916374959979       # Reset specific customer")
            print("  python check_customers.py clear                    # Clear all customers")
    else:
        # Default: show all customers
        check_customers()
