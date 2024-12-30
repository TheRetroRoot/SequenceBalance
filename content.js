(function () {
    console.log("Content script triggered.");

    function processTable() {
        const table = document.querySelector("table"); // Find the table
        if (!table) {
            alert("Table not found on the page.");
            console.log("No table found.");
            chrome.runtime.sendMessage({ type: "balances", data: {} });
            return;
        }

        console.log("Table found. Processing...");
        const rows = Array.from(table.querySelectorAll("tr")).slice(1); // Skip the header row
        const beneficiaries = {};

        rows.forEach((row, index) => {
            const cells = row.querySelectorAll("td");
            if (cells.length < 5) {
                console.log(`Row ${index} skipped: not enough cells.`);
                return;
            }

            // Check if the row is labeled "POD" or "Income Source" in the second column
            const label = cells[1]?.querySelector("p")?.textContent?.trim();
            const isRelevantRow = label === "Pod" || label === "Income Source";

            // Extract Beneficiary from the fifth column
            const beneficiary = cells[4]?.querySelector("p")?.textContent?.trim();

            // Extract Amount from the sixth column
            const amountText = cells[5]?.querySelector("p")?.textContent?.trim();
            const amount = parseFloat(amountText?.replace(/[^0-9.-]+/g, "")) || 0;

            if (isRelevantRow && beneficiary && !isNaN(amount)) {
                console.log(`Row ${index} - Label: ${label}, Beneficiary: ${beneficiary}, Amount: ${amount}`);
                beneficiaries[beneficiary] = (beneficiaries[beneficiary] || 0) + amount;
            }
        });

        console.log("Beneficiaries and balances:", beneficiaries);

        // Send the results back to the popup
        chrome.runtime.sendMessage({ type: "balances", data: beneficiaries });
    }

    processTable();
})();

