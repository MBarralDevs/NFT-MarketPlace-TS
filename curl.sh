curl --request POST \
  --url https://api.circle.com/v1/w3s/compliance/screening/addresses \
  --header 'Authorization: Bearer TEST_API_KEY:57692d4c35db42adf5b0d98388ecf78a:3ef25a23f6850996b5d1d039097506bf' \
  --header 'Content-Type: application/json' \
  --data '{
  "idempotencyKey": "b9303cec-7d2b-4ba9-85b1-7f8eb3d728ae",
  "address": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "chain": "ETH-SEPOLIA"
}'