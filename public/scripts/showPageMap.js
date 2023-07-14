mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

// Create a new marker.
// Set marker options.
const marker = new mapboxgl.Marker({
    color: "teal",
    draggable: false
}).setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
)
    .addTo(map);


    const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');