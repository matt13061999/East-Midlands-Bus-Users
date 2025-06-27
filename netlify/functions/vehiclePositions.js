const fetch = require('node-fetch');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

exports.handler = async () => {
  try {
    const res = await fetch(
      'https://api.bus-data.dft.gov.uk/v2/vehicle-activity/gtfs-rt',
      { headers: { 'x-api-key': '8806c5993f182bf0c02943fe00898b0f29b088fa' } }
    );
    const buffer = await res.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

    const buses = feed.entity
      .filter(e => e.vehicle && e.vehicle.position)
      .map(e => ({
        id: e.id,
        lat: e.vehicle.position.latitude,
        lon: e.vehicle.position.longitude,
        heading: e.vehicle.position.heading
      }));

    return { statusCode: 200, body: JSON.stringify(buses) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
