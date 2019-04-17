import API from '@library/API';
import settings from '@config/settings';

var api = new API(settings);
function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default app => {
  app.on('profile-search', async (req, res) => {
    let query = {};
    if (req.getStage()) {
      query = req.getStage();
    }

    let result = await api
      .authenticated()
      .get('profiles/search', query);

    res.setResults(result.data);
  });

  app.on('profile-recover', async (req, res) => {
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
      .post('profiles/recover', payload, query);

    res.setResults(result.data)
  });

  app.on('profile-kyc-update', async (req, res) => {
    let stage = req.getStage();
    let upload = false;
    let query = {};

    if (typeof stage.level == 'undefined') {
      res.setError(true, 'Invalid level');
      return;
    }

    if (typeof stage.payload != 'undefined') {
      payload = req.getStage('payload');
    }

    if (typeof stage.upload != 'undefined') {
      upload = true;
    }

    if (typeof stage.dev != 'undefined' && stage.dev) {
      query.dev = true;
    }

    let result = await api
      .authenticated()
      .upload(upload)
      .post('profiles/kyc/level-' + stage.level, payload, query);

    res.setResults(result.data);
  });

  app.on('profile-current-detail', async (req, res) => {
    let query = {};
    if (req.getStage()) {
      query = req.getStage();
    }

    let result = await api
      .authenticated()
      .get('devices/me', query);

    res.setResults(result.data);
  });
}
