import app from '@library/AppHandler';
import DeviceModule from '@module/device/register';

app.register(DeviceModule);

var unidiq = function() {
  var n = Math.floor(Math.random() * 11);
  var k = Math.floor(Math.random() * 1000000);
  return String.fromCharCode(n) + k;
}

// prepare data, let's make up our own since
// since this is a test that is not supposed to run on a device
// but has to make sure that device register event
// can be called and that it calls the API
// and save device details
var data = {
  dev: true,
  device_unique_id: unidiq() + '-' + unidiq(),
  device_model: 'Iphone 6s'
}

test('Device Register event', async () => {
  // console.log(data);
  let device = await app.method('device-register', data);

  expect(device).not.toBeNull();
  expect(device.device_unique_id).toBe(data.device_unique_id);
  expect(device.device_model).toBe(data.device_model);

  data = device;
});

test('Device Update event', async () => {
  let update = {
    dev: true,
    device_id: data.device_id,
    device_active: 0
  };

  // console.log(data);
  let device = await app.method('device-update', update);

  expect(device).not.toBeNull();
  expect(device.device_unique_id).toBe(data.device_unique_id);
  expect(device.device_model).toBe(data.device_model);
  expect(device.device_active).toBe(0);
});
