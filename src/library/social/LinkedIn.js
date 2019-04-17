// dependencies
import axios from 'axios';

/**
 * Linkedin Social Class
 */
export default class LinkedIn {
  /**
   * Linkedin Social Class Constructor
   *
   * @param {String} token
   */
  constructor(token) {
      this.baseUrl = 'https://api.linkedin.com/v1/';

      // set token
      this.token = token;
  }

  /**
   * Fetches the detail of a person from the LinkedIn's API.
   *
   * @return {Promise}
   */
  getPerson() {
    return new Promise((resolve, reject) => {
      // fields to fetch
      const params = [
        'id',
        'first-name',
        'last-name',
        'picture-urls::(original)',
        'public-profile-url'
      ];

      // build out the request url
      const requestUrl = [
        this.baseUrl,
        'people/~:',
        '(' + params.join(',') + ')'
      ].join('');

      console.log('[Requesting URL]', requestUrl);

      axios.get(requestUrl, {
        params: { 'format': 'json' },
        headers: {
          'Authorization': 'Bearer ' + this.token,
        }
      })
      .then((response) => {
        let data = response.data;

        // set values
        let profile = {
          first_name: data.firstName,
          last_name: data.lastName,
          linkedin_id: data.id,
          profile_url: data.publicProfileUrl
        }

          // just retrieve the necessary data from the request
          // check for the image
          if (data.pictureUrls && data.pictureUrls._total > 0) {
            // get it
            profile = {
              ...profile,
              image: data.pictureUrls.values[0]
            };
          }

          // return it
          resolve(profile);
      })
      .catch((error) => {
        reject(error);
      });
    });
  }
}
