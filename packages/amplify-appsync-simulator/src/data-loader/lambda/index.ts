import { AmplifyAppSyncSimulatorDataLoader, reqIdentity } from '..';
import DataLoader from 'dataloader';

const batchLoaders = {};

const getBatchDataResolver = (loaderName, resolver) => {
  if (batchLoaders[loaderName] === undefined) {
    batchLoaders[loaderName] = new DataLoader(resolver, { cache: false });
  }
  return batchLoaders[loaderName];
};

export class LambdaDataLoader implements AmplifyAppSyncSimulatorDataLoader {
  constructor(private _config) {}

  async load(req, extraData) {
    try {
      let result;
      const { fieldName, parentType } = extraData.info;
      if (req.operation === 'BatchInvoke') {
        const batchName = `${parentType}.${fieldName}`;
        const dataLoader = getBatchDataResolver(batchName, this._config.invoke);
        result = await dataLoader.load({
          arguments: extraData?.args,
          identity: reqIdentity,
          source: req.payload,
          parentTypeName: parentType,
          fieldName: fieldName,
        });
      } else {
        result = await this._config.invoke({
          arguments: extraData?.args,
          identity: reqIdentity,
          source: req.payload,
          parentTypeName: parentType,
          fieldName: fieldName,
        });
      }
      return result;
    } catch (e) {
      console.log('Lambda Data source failed with the following error');
      console.error(e);
      throw e;
    }
  }
}
