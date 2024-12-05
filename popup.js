document.getElementById("calculate").addEventListener("click", () => {
    // Send a message to the content script to process the table
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["content.js"]
        });
    });

    // Listen for the response from the content script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === "balances") {
            const balancesDiv = document.getElementById("balances");
            balancesDiv.innerHTML = ""; // Clear previous content
            const balances = message.data;

            if (Object.keys(balances).length === 0) {
                balancesDiv.textContent = "No POD balances found.";
                return;
            }

            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });

            for (const [beneficiary, total] of Object.entries(balances)) {
                const item = document.createElement("div");
                item.className = "balance-item";

                const beneficiaryDiv = document.createElement("span");
                beneficiaryDiv.className = "beneficiary";
                beneficiaryDiv.textContent = beneficiary;

                const amountDiv = document.createElement("span");
                amountDiv.className = "amount";
                amountDiv.textContent = formatter.format(total);

                item.appendChild(beneficiaryDiv);
                item.appendChild(amountDiv);

                balancesDiv.appendChild(item);
            }
        }
    });
});

