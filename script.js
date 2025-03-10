document.getElementById('search-btn').addEventListener('click', async () => {
    const countryName = document.getElementById('country-input').value.trim();
    if (!countryName) {
        alert('Please enter a country name');
        return;
    }

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        if (!response.ok) throw new Error('Country not found');

        const data = await response.json();
        const country = data[0];

        const countryInfo = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" />
        `;

        document.getElementById('country-info').innerHTML = countryInfo;

        if (country.borders) {
            const borders = await Promise.all(
                country.borders.map(async (border) => {
                    const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${border}`);
                    const borderData = await borderResponse.json();
                    const borderCountry = borderData[0];
                    return `
                        <div>
                            <p>${borderCountry.name.common}</p>
                            <img src="${borderCountry.flags.svg}" alt="Flag of ${borderCountry.name.common}" />
                        </div>
                    `;
                })
            );
            document.getElementById('bordering-countries').innerHTML = `<h3>Bordering Countries:</h3>${borders.join('')}`;
        } else {
            document.getElementById('bordering-countries').innerHTML = '<h3>No bordering countries</h3>';
        }
    } catch (error) {
        alert(error.message);
        document.getElementById('country-info').innerHTML = '';
        document.getElementById('bordering-countries').innerHTML = '';
    }
});