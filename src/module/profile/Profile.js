import AppHandler from '@library/AppHandler';
import EventEmitter from '@library/core/EventEmitter';
import ProfileModule from '@module/profile/register';

export default class Profile
{
  method(event, req, res) {
    return new Promise((resolve, reject) => {
      resolve('hey');
      // var app = AppHandler
      //   .register(ProfileModule);
      //
      // console.log('APP', app);
      //
      // resolve (app.method(event, {dev: true}));
    });
  }
}
