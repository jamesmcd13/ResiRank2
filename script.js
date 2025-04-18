mapboxgl.accessToken = 'pk.eyJ1IjoiZGF0YXJhbmtpdCIsImEiOiJjbGZzZ2N3a3AwMTVtM3VwYzVjZjlyd3FuIn0.YKk_k1JYfyuGSmgt58A7yw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-streets-v11',
  center: [-118.45, 34.05],
  zoom: 11
});

let selectedAreas = [];

map.on('load', () => {
  map.addSource('mlsAreas', {
    type: 'geojson',
    data: './mls-areas.geojson'
  });

  map.addLayer({
    id: 'mls-fill',
    type: 'fill',
    source: 'mlsAreas',
    paint: {
      'fill-color': [
        'case',
        ['in', ['get', 'mls_area_id'], ['literal', selectedAreas.map(a => a.id)]], '#003366',
        'transparent'
      ],
      'fill-opacity': 0.2
    }
  });

  map.addLayer({
    id: 'mls-outline',
    type: 'line',
    source: 'mlsAreas',
    paint: {
      'line-color': '#003366',
      'line-width': 2
    }
  });

  map.addLayer({
    id: 'mls-labels',
    type: 'symbol',
    source: 'mlsAreas',
    layout: {
      'text-field': ['get', 'mls_area_name'],
      'text-size': 14
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#000000',
      'text-halo-width': 1.5
    }
  });

  map.on('click', 'mls-fill', (e) => {
    const id = e.features[0].properties.mls_area_id;
    const name = e.features[0].properties.mls_area_name;
    const index = selectedAreas.findIndex((a) => a.id === id);
    if (index > -1) {
      selectedAreas.splice(index, 1);
    } else {
      selectedAreas.push({ id, name });
    }
    updateSidebar();
    map.setPaintProperty('mls-fill', 'fill-color', [
      'case',
      ['in', ['get', 'mls_area_id'], ['literal', selectedAreas.map(a => a.id)]], '#003366',
      'transparent'
    ]);
  });
});

document.getElementById('reset').addEventListener('click', () => {
  selectedAreas = [];
  updateSidebar();
  map.setPaintProperty('mls-fill', 'fill-color', [
    'case',
    ['in', ['get', 'mls_area_id'], ['literal', []]], '#003366',
    'transparent'
  ]);
});

document.getElementById('submit').addEventListener('click', () => {
  console.log('Selected MLS Areas:', selectedAreas);
  alert('Check your browser console to see the submitted data.');
});

function updateSidebar() {
  const list = document.getElementById('selected-list');
  list.innerHTML = '';
  selectedAreas.forEach((a) => {
    const li = document.createElement('li');
    li.textContent = a.name;
    list.appendChild(li);
  });
}
