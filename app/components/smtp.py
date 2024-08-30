import smtplib

# List of SMTP credentials
smtp_servers = [
    {
        "host": "smtp.office365.com",
        "port": 587,
        "username": "autenticacao@resolv.com.br",
        "password": "R$solv#2023",
        "from_email": "autenticacao@resolv.com.br",
    },
    {
        "host": "smtp.office365.com",
        "port": 587,
        "username": "rafavds2010@edu.univali.br",
        "password": "emmit6555",
        "from_email": "rafavds2010@edu.univali.br",
    },
    {
        "host": "smtp.office365.com",
        "port": 587,
        "username": "farmgoinvoices@farm.com.sa",
        "password": "Farm@Fa123#",
        "from_email": "farmgoinvoices@farm.com.sa",
    },
    {
        "host": "smtp.office365.com",
        "port": 587,
        "username": "ads_712845@privatemoe.ae",
        "password": "Moe@1020304050",
        "from_email": "ads_712845@privatemoe.ae",
    }
]

def test_smtp(smtp_info):
    try:
        server = smtplib.SMTP(smtp_info["host"], smtp_info["port"])
        server.starttls()  # Secure the connection
        server.login(smtp_info["username"], smtp_info["password"])
        server.quit()
        print(f"SMTP credentials for {smtp_info['username']} are working.")
    except Exception as e:
        print(f"Failed to connect with {smtp_info['username']}: {e}")

# Run the test for each SMTP server
for smtp_info in smtp_servers:
    test_smtp(smtp_info)
