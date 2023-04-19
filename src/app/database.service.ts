import { Injectable } from '@angular/core';
import { MongoClient, MongoClientOptions } from 'mongodb';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private client!: MongoClient;
  private url = 'mongodb://localhost:27017/ezbook';

  constructor() {
    this.connectToDb();
  }

  private async connectToDb() {
    const options: MongoClientOptions = {
      useUnifiedTopology: true
    };
    try {
      this.client = await MongoClient.connect(this.url, options);
      console.log('Connected to database');
    } catch (err) {
      console.log('Error connecting to database: ', err);
    }
  }

  public getCollection(collectionName: string) {
    return this.client.db().collection(collectionName);
  }
}
