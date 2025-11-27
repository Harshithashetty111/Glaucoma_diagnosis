import requests
url = "http://127.0.0.1:8000/api/auth/register"
payload = {
    "name": "Dr Test",
    "email": "drtest_debug@example.com",
    "password": "Pass123",     # short test password
    "hospital": "City Hospital",
    "specialization": "Glaucoma",
    "experience_years": 5
}
r = requests.post(url, json=payload)
print("status:", r.status_code)
print("text:", r.text)
