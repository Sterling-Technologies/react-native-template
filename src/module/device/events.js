import API from '@library/API';
import settings from '@config/settings';

var api = new API(settings);
function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default app => {
  app.on('device-register', async (req, res) => {
    let payload = {};
    let query = {};

    if (req.getStage()) {
      payload = req.getStage();
    }

    if (typeof req.getStage('dev') != 'undefined' && req.getStage('dev')) {
      query.dev = true;
      delete payload.dev;
    }

    let result = await api
      .authenticated()
      .post('devices/register', payload, query);

    res.setResults(result.data);
  });

  app.on('device-update', async (req, res) => {
    let stage = req.getStage();
    let upload = false;
    let query = {};
    let id = null;

    if (typeof stage.device_id == 'undefined') {
      res.setError(true, 'Unknown Device');
      return;
    }

    if (typeof req.getStage('dev') != 'undefined' && req.getStage('dev')) {
      query.dev = true;
      delete stage.dev;
    }

    id = stage.device_id;
    delete stage.device_id;

    // if (typeof stage.payload != 'undefined') {
    //   payload = req.getStage('payload')
    // }

    let result = await api
      .authenticated()
      .upload(upload)
      .post('devices/update/' + id, stage, query);

    res.setResults(result.data);
  });
}
