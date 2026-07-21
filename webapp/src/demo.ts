export const DEMO_SCRIPT = `# Welcome to jcalc — a natural language calculator!
# Click Demo again anytime to reset this example.

# Everyday math with multi-word variables
apples = 12
price per apple = $0.50
total cost = apples * price per apple

# A rate calculation, simplified back to plain dollars
hourly rate = $45/hour
hours worked = 37.5 hours
weekly pay = hourly rate * hours worked
weekly pay to $

# Currency aliases are interchangeable
tip = 12 usd
bill = 88 dollars
total bill = bill + tip

# Comma-separated numbers work too
mortgage = $350,000
down payment = mortgage * 0.2
loan amount = mortgage - down payment

# Unit conversions
marathon = 26.2 miles
marathon to km

# Trailing comments are stripped before the line is evaluated
tax rate = 0.08 // 8% sales tax
tax = total cost * tax rate`;
