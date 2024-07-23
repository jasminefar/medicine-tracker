document.addEventListener('DOMContentLoaded', () => {
    const medicines = JSON.parse(localStorage.getItem('medicines')) || [];
    const history = JSON.parse(localStorage.getItem('history')) || [];

    const addMedicineForm = document.getElementById('add-medicine-form');
    const scheduleDosageForm = document.getElementById('schedule-dosage-form');
    const historyList = document.getElementById('history-list');
    const upcomingDosagesList = document.getElementById('upcoming-dosages-list');

    function saveData() {
        localStorage.setItem('medicines', JSON.stringify(medicines));
        localStorage.setItem('history', JSON.stringify(history));
    }

    function renderHistory() {
        historyList.innerHTML = '';
        history.forEach(record => {
            const div = document.createElement('div');
            div.textContent = `Medicine: ${record.name}, Dosage: ${record.dosage}, Taken At: ${record.timestamp}`;
            historyList.appendChild(div);
        });
    }

    function renderUpcomingDosages() {
        upcomingDosagesList.innerHTML = '';
        medicines.forEach(med => {
            const div = document.createElement('div');
            div.textContent = `ID: ${med.id}, Name: ${med.name}, Next Dose: ${med.next_dose}`;
            upcomingDosagesList.appendChild(div);
        });
    }

    addMedicineForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('medicine-name').value;
        const dosage = document.getElementById('dosage').value;
        const frequency = parseInt(document.getElementById('frequency').value);
        const next_dose = new Date().toLocaleString();
        const medicine = { id: medicines.length + 1, name, dosage, frequency, next_dose };
        medicines.push(medicine);
        saveData();
        addMedicineForm.reset();
        renderUpcomingDosages();
        alert(`Medicine '${name}' added.`);
    });

    scheduleDosageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const med_id = parseInt(document.getElementById('medicine-id').value);
        const med = medicines.find(m => m.id === med_id);
        if (med) {
            const intake = {
                medicine_id: med.id,
                name: med.name,
                dosage: med.dosage,
                timestamp: new Date().toLocaleString()
            };
            history.push(intake);
            const nextDoseTime = new Date(Date.now() + med.frequency * 60 * 60 * 1000).toLocaleString();
            med.next_dose = nextDoseTime;
            saveData();
            renderHistory();
            renderUpcomingDosages();
            alert(`Medicine '${med.name}' taken.`);
            scheduleDosageForm.reset();
        } else {
            alert(`Medicine ID ${med_id} not found.`);
        }
    });

    renderHistory();
    renderUpcomingDosages();
});
