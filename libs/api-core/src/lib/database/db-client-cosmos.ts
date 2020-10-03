import { Injectable } from '@nestjs/common';
import { ConfigService } from '../configuration/config.service';
import { LogService } from '../logging/log.service';

@Injectable()
export class DBClientCosmos {
  private cosmosDatabase: string;
  private cosmosKey: string;
  private cosmosEndpoint: string;
  // private client: cosmos.CosmosClient;
  // private database: cosmos.Database;
  // private containers: { [containerName: string]: cosmos.Container } = {};

  constructor(
    private readonly configService: ConfigService,
    private readonly logService: LogService
  ) {
    this.cosmosDatabase = configService.get('COSMOS_DATABASE');
    this.cosmosKey = configService.get('COSMOS_KEY');
    this.cosmosEndpoint = configService.get('COSMOS_ENDPOINT');
  }

  async onModuleInit() {
    /*this.logService.log('initializing cosmos client');
    this.logService.log(`CosmosKey: ${this.cosmosKey}`);
    let disableSSL = false;
    if (this.configService.isDevelopment) {
      disableSSL = true;
    }
    this.client = new cosmos.CosmosClient(
      {
        endpoint: this.cosmosEndpoint,
        connectionPolicy: {
          DisableSSLVerification: disableSSL,
          RetryOptions: {
            MaxRetryAttemptCount: 3,
            FixedRetryIntervalInMilliseconds: 500,
            MaxWaitTimeInSeconds: 2,
          },
        },
        auth: { masterKey: this.cosmosKey },
      });
    try {
    } catch (err) {
      this.logService.error(err.body, err.Error);
    }*/
  }

  /* async createDatabase(): Promise<cosmos.Database> {
    const { database } = await this.client.databases.createIfNotExists({ id: this.cosmosDatabase });
    this.logService.info(`Created database:${database.id}`, 'DbClientService');
    return database;
  }

  async createContainer(containerName: string): Promise<cosmos.Container> {
    const { container } = await this.client.database(this.cosmosDatabase)
      .containers.createIfNotExists({ id: containerName });
    this.logService.log(`Created container:\n${container.id}`);
    return container;
  }

  async insert<T extends BaseDocument>(item: T): Promise<T> {
    const currentUser = RequestContext.currentUser();
    auditUtils.setCreateAuditInfo(currentUser, item as unknown as BaseDocument);
    try {
      item[BaseDocumentField.id] = cuid();
      item[BaseDocumentField.partitionId] = item[BaseDocumentField.id];
      const containerName = currentUser.container;
      const container = this.containers[containerName];
      if (!container) {
        this.containers[containerName] = await this.createContainer(containerName);
      }
      const itemResponse = await this.containers[containerName].items.create<T>(item);
      this.logService.log(`created item eTag` + itemResponse.body._etag);
      return itemResponse.body;
    } catch (err) {
      throw err;
    }
  }

  async update<T>(id: string, item: T): Promise<T> {
    const currentUser = RequestContext.currentUser();
    auditUtils.setUpdateAuditInfo(currentUser, item as unknown as BaseDocument);
    const containerName = currentUser.container;
    const container = this.containers[containerName];
    if (!container) {
      this.containers[containerName] = await this.createContainer(containerName);
    }
    try {
      const itemResponse = await this.containers[containerName].item(id, partitionKey).replace<T>
        (item, { accessCondition: { type: 'IfMatch', condition: (item as unknown as BaseDocument)._etag } });
      return itemResponse.body;
    } catch (err) {
      if (err.code === 412) {
        throw new BadRequestException('Someone has changed the data before you, please refresh and retry your update');
      } else {
        throw err;
      }
    }
  }

  private getContainerName(): string {
    const currentUser = RequestContext.currentUser();
    return currentUser.container;
  }

  async queryItems<T>(query: cosmos.SqlQuerySpec): Promise<T[]> {
    const containerName = this.getContainerName();
    const container = this.containers[containerName];
    if (!container) {
      this.containers[containerName] = await this.createContainer(containerName);
    }
    const list = new Array<T>();
    const queryIterator = await this.containers[containerName].items.query<T>(
      query,
      {
        enableCrossPartitionQuery: true,
        maxDegreeOfParallelism: 1,
        maxItemCount: -1,
      },
    );
    while (queryIterator.hasMoreResults()) {
      const dataSet = await queryIterator.toArray();
      if (dataSet.result) {
        list.push(...dataSet.result);
      }
      queryIterator.executeNext();
    }
    return list;
  }

  async readItemAsync<T>(id: string, partitionKey?: string): Promise<T> {
    if (!partitionKey) {
      partitionKey = id;
    }
    const containerName = this.getContainerName();
    const container = this.containers[containerName];
    if (!container) {
      this.containers[containerName] = await this.createContainer(containerName);
    }
    const item = await this.containers[containerName].item(id, partitionKey);
    const itemResponse = await item.read<T>();
    if (itemResponse.body == null) {
      throw new Error(`Object not found - partition:${partitionKey}, id:${id}`);
    }
    return itemResponse.body;
  }*/
}
