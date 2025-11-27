import requests

url = "http://127.0.0.1:8000/api/auth/login"
payload = {
    "email": "drtest_debug@example.com",
    "password": "Pass123"
}

r = requests.post(url, json=payload)
print("status:", r.status_code)
print("text:", r.text)
