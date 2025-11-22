curl --request POST \
  --url https://api.circle.com/v1/w3s/compliance/screening/addresses \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "idempotencyKey": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "address": "0x1bf9ad0cc2ad298c69a2995aa806ee832788218c",
  "chain": "MATIC-AMOY"
}'