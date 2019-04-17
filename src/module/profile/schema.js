import { SqlSchema } from '@library/sql';

//define the schema
export default SqlSchema
  .load()
  .addField('profile_id', 'primary');
