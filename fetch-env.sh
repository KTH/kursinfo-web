#!/bin/bash

# Accept RESOURCE_GROUP and APP_NAME as arguments
RESOURCE_GROUP=$1
APP_NAME=$2
OUTPUT_FILE=".env"

# Check if required arguments are provided
if [ -z "$RESOURCE_GROUP" ] || [ -z "$APP_NAME" ]; then
    echo "Usage: bash ./resolve-env.sh <RESOURCE_GROUP> <APP_NAME>"
    exit 1
fi

# Function to fetch secrets from Azure Key Vault
fetch_keyvault_secret() {
    local secret_reference="$1"
    local vault_name
    local secret_name

    # Extract the Key Vault name and secret name
    vault_name=$(echo "$secret_reference" | sed -n 's/.*VaultName=\([^;]*\).*/\1/p')
    secret_name=$(echo "$secret_reference" | sed -n 's/.*SecretName=\([^)]*\).*/\1/p')

    if [ -z "$vault_name" ] || [ -z "$secret_name" ]; then
        echo "Error parsing Key Vault reference: $secret_reference"
        return 1
    fi

    # Fetch the secret value
    az keyvault secret show --vault-name "$vault_name" --name "$secret_name" --query "value" -o tsv 2>/dev/null
}

# Fetch App Settings from Azure App Service
echo "Fetching environment variables from App Service..."
app_settings=$(az webapp config appsettings list --resource-group "$RESOURCE_GROUP" --name "$APP_NAME" --query "[].{name:name, value:value}" -o json)

if [ -z "$app_settings" ]; then
    echo "Failed to fetch app settings. Ensure the Azure CLI is configured and you have access to the App Service."
    exit 1
fi

# Write to .env file
echo "# Fetched Environment Variables" > "$OUTPUT_FILE"

# Process each setting
echo "$app_settings" | jq -c '.[]' | while read -r setting; do
    name=$(echo "$setting" | jq -r '.name')
    value=$(echo "$setting" | jq -r '.value')

    # Check if the value is a Key Vault reference
    if [[ "$value" == @Microsoft.KeyVault* ]]; then
        echo "Fetching Key Vault reference for $name..."
        resolved_value=$(fetch_keyvault_secret "$value")
        if [ $? -ne 0 ]; then
            resolved_value="ERROR_FETCHING_SECRET"
        fi
    else
        resolved_value="$value"
    fi

    # Write to the .env file
    echo "${name}=${resolved_value}" >> "$OUTPUT_FILE"
done

echo "Fetched environment variables written to $OUTPUT_FILE"
