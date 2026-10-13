const API_KEY = 'cb184fb848ebd6d5bc51949510101334';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const form = document.querySelector('#searchForm');
const input = document.querySelector('#cityInput');
const loading = document.querySelector('#loading');
const errorEl = document.querySelector('#error');
const result = document.querySelector('#weatherResult');

const showLoading = () => {
  loading.classList.remove('hidden');
  errorEl.classList.add('hidden');
  result.classList.add('hidden');
};

const hideLoading = () => {
  loading.classList.add('hidden');
};

const showError = (message) => {
  errorEl.textContent = `❌ ${message}`;
  errorEl.classList.remove('hidden');
  result.classList.add('hidden');
};

const getWeather = async (city) => {
  try {
    showLoading();

    // 1. Buat URL dengan template literal
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=id`;

    // 2. Fetch data
    const res = await fetch(url);

    // 3. Error handling: Kota tidak ditemukan (404)
    if (res.status === 404) {
      throw new Error(`Kota "${city}" tidak ditemukan.`);
    }

    // 4. Error handling: Server error lainnya
    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    // 5. Parse JSON
    const data = await res.json();

    // 6. Tampilkan data
    displayWeather(data);

  } catch (err) {
    // 7. Error handling: Network error (misal tidak ada internet)
    if (err.name === 'TypeError') {
      showError('Network error. Periksa koneksi internet Anda.');
    } else {
      showError(err.message);
    }
  } finally {
    // 8. Selalu sembunyikan loading
    hideLoading();
  }
};

const displayWeather = (data) => {
  // Menggunakan array method (map) untuk memproses data
  // Kita map array weather untuk mengambil deskripsi dan icon
  const weatherDetails = data.weather.map(item => ({
    description: item.description,
    icon: item.icon
  }));

  // Ambil data pertama hasil map
  const { description, icon } = weatherDetails[0];

  // Update DOM dengan template literals
  document.querySelector('#cityName').textContent = data.name;
  document.querySelector('#temperature').textContent = `${Math.round(data.main.temp)}°C`;
  document.querySelector('#description').textContent = description;
  document.querySelector('#humidity').textContent = `💧 Kelembaban: ${data.main.humidity}%`;
  
  // Set icon cuaca
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  document.querySelector('#weatherIcon').src = iconUrl;

  // Tampilkan hasil
  result.classList.remove('hidden');
};

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Mencegah reload halaman
  
  const city = input.value.trim();
  
  if (!city) {
    showError('Nama kota tidak boleh kosong!');
    return;
  }

  getWeather(city);
});