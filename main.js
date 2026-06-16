const tbody = document.getElementById("tableBody");

let filters = { name: "", role: "", attribute: "", combat: "" };
let sortLevels = [
    { field: "none", order: "asc" },
    { field: "none", order: "asc" },
    { field: "none", order: "asc" }
];

function renderTable(data) {
    tbody.innerHTML = "";
    data.forEach((hero, index) => {
        const combatLabel = hero.combat === "Ближний бой" ? "Ближний бой" : "Дальний бой";
        const row = `<tr>
            <td>${index + 1}</td>
            <td>${hero.name}</td>
            <td>${hero.roles.join(", ")}</td>
            <td>${hero.attribute}</td>
            <td>${hero.strength}</td>
            <td>${hero.agility}</td>
            <td>${hero.intelligence}</td>
            <td>${combatLabel}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function filterData(data) {
    return data.filter(hero => {
        const nameMatch = !filters.name ||
            hero.name.toLowerCase().includes(filters.name.toLowerCase());

        const roleMatch = !filters.role ||
            hero.roles.some(r => r.toLowerCase().includes(filters.role.toLowerCase()));

        const attrMatch = !filters.attribute ||
            hero.attribute.toLowerCase().includes(filters.attribute.toLowerCase());

        const combatRaw = hero.combat.toLowerCase();
        const combatRu = hero.combat === "Дальний бой" ? "дальний бой" : "ближний бой";
        const combatMatch = !filters.combat ||
            combatRaw.includes(filters.combat.toLowerCase()) ||
            combatRu.includes(filters.combat.toLowerCase());

        return nameMatch && roleMatch && attrMatch && combatMatch;
    });
}
function sortData(data) {
    return [...data].sort((a, b) => {
        for (let i = 0; i < 3; i++) {
            const { field, order } = sortLevels[i];
            if (field !== "none") {
                let valA = a[field];
                let valB = b[field];

                if (field === "attribute") {
                    const attrMap = { "Сила": 1, "Ловкость": 2, "Интеллект": 3 };
                    valA = attrMap[valA] || 0;
                    valB = attrMap[valB] || 0;
                }

                let cmp = 0;
                if (valA > valB) cmp = 1;
                else if (valA < valB) cmp = -1;

                if (cmp !== 0) return order === "asc" ? cmp : -cmp;
            }
        }
        return 0;
    });
}

function updateTable() {
    let filtered = filterData(heroes);
    let sorted = sortData(filtered);
    renderTable(sorted);
}

function updateSortOptions() {
    const usedFields = sortLevels.filter(l => l.field !== "none").map(l => l.field);

    for (let i = 0; i < 3; i++) {
        const select = document.getElementById(`sort${i + 1}Field`);
        if (!select) continue;

        const currentField = sortLevels[i].field;
        for (let opt of select.options) {
            if (opt.value !== "none" && opt.value !== currentField) {
                opt.disabled = usedFields.includes(opt.value);
            } else {
                opt.disabled = false;
            }
        }
    }
}

function resetSortDropdowns() {
    sortLevels = [
        { field: "none", order: "asc" },
        { field: "none", order: "asc" },
        { field: "none", order: "asc" }
    ];
    for (let i = 0; i < 3; i++) {
        const fieldSel = document.getElementById(`sort${i + 1}Field`);
        const orderSel = document.getElementById(`sort${i + 1}Order`);
        if (fieldSel) fieldSel.value = "none";
        if (orderSel) orderSel.value = "asc";
    }
    updateSortOptions();
}

document.addEventListener("DOMContentLoaded", () => {
    // Элементы фильтра
    const filterRole      = document.getElementById("filterRole");
    const filterAttribute = document.getElementById("filterAttribute");
    const filterCombat    = document.getElementById("filterCombat");
    const filterForm      = document.getElementById("filter");
    const findBtn         = document.getElementById("findBtn");
    const clearBtn        = document.getElementById("clearBtn");

    // Элементы сортировки
    const sortApplyBtn    = document.getElementById("sortApplyBtn");
    const sortResetBtn    = document.getElementById("sortResetBtn");

    // 1. Сбор данных из фильтров (без перерисовки таблицы)
    if (filterRole) filterRole.addEventListener("change", e => filters.role = e.target.value);
    if (filterAttribute) filterAttribute.addEventListener("change", e => filters.attribute = e.target.value);
    if (filterCombat) filterCombat.addEventListener("change", e => filters.combat = e.target.value);

    // 2. Сбор данных из сортировки (без перерисовки таблицы)
    for (let i = 0; i < 3; i++) {
        const fieldSelect = document.getElementById(`sort${i + 1}Field`);
        const orderSelect = document.getElementById(`sort${i + 1}Order`);

        if (fieldSelect) fieldSelect.addEventListener("change", e => {
            sortLevels[i].field = e.target.value;
            updateSortOptions();
        });

        if (orderSelect) orderSelect.addEventListener("change", e => {
            sortLevels[i].order = e.target.value;
        });
    }

    // 3. Кнопка "Найти" (применяет фильтры И сортировку)
    if (findBtn) findBtn.addEventListener("click", () => {
        filters.name      = document.getElementById("heroName").value.trim();
        filters.role      = document.getElementById("filterRole").value.trim();
        filters.attribute = document.getElementById("filterAttribute").value.trim();
        filters.combat    = document.getElementById("filterCombat").value.trim();
        updateTable();
    });

    // 4. Кнопка "Очистить всё" (сбрасывает фильтры и сортировку)
    if (clearBtn) clearBtn.addEventListener("click", () => {
        if (filterForm) filterForm.reset();
        filters = { name: "", role: "", attribute: "", combat: "" };
        resetSortDropdowns();
        updateTable();
    });

    // 5. Кнопка "Применить сортировку"
    if (sortApplyBtn) sortApplyBtn.addEventListener("click", () => {
        updateTable();
    });

    // 6. Кнопка "Сбросить сортировку"
    if (sortResetBtn) sortResetBtn.addEventListener("click", () => {
        resetSortDropdowns();
        updateTable();
    });

    // Инициализация при загрузке
    updateSortOptions();
    updateTable();
});