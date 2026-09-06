"""Backend formatting utilities."""

def format_inr(amount: float) -> str:
    """Format decimal/float amount to INR currency string representation."""
    return f"₹{amount:,.2f}"

def sanitize_phone(phone_str: str) -> str:
    """Normalize phone numbers removing spaces and dashes."""
    if not phone_str:
        return ""
    return "".join(c for c in phone_str if c.isdigit() or c == '+')
