import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  collection,
  getDocs,
  addDoc,
  getFirestore,
  where,
  query,
  updateDoc,
  orderBy,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import AppConstant from '../constants/app.constant';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  public readonly firebaseConfig = {
    apiKey: 'AIzaSyC-bdbWfZZb48o3q1v4cjlrnxiYOybMQco',
    authDomain: 'trspokemania.firebaseapp.com',
    projectId: 'trspokemania',
    storageBucket: 'trspokemania.appspot.com',
    messagingSenderId: '485587655756',
    appId: '1:485587655756:web:3407823b74de996b7668e9',
  };

  // Initialize Firebase
  public app = initializeApp(this.firebaseConfig);
  public db = getFirestore();
  constructor() {}

  public async getListUser() {
    const querySnapshot = await getDocs(collection(this.db, 'users'));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  }

  public async getUserById(id: string) {
    try {
      const queryGetById = query(
        collection(this.db, 'users'),
        where('id', '==', id)
      );
      const querySnapshot = await getDocs(queryGetById);
      let user = null;
      querySnapshot.forEach((doc) => {
        user = { ...doc.data(), fireStoreId: doc.id };
        return;
      });
      console.log('--------', user);
      return user;
    } catch (error) {
      return 'error';
    }
  }

  public async addUser(user: any) {
    if (!user) {
      return;
    }
    try {
      const docRef = await addDoc(collection(this.db, 'users'), {
        ...user,
        role: AppConstant.Roles.user,
      });

      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  public async createTable(user: any, currentTime: any, buyIn: any) {
    if (!user) {
      return;
    }
    try {
      const docRef = await addDoc(collection(this.db, 'table'), {
        createdTime: currentTime,
        buyInUnit: buyIn,
      });

      const pokeristDocRef = await addDoc(
        collection(this.db, 'pokeristInTable'),
        {
          userId: user.id,
          userName: user.name,
          buyInQuantity: 1,
          isKey: true,
          returnMoney: 0,
          tableId: docRef.id,
          balance: -buyIn,
        }
      );
      console.log('Document written with ID: ', docRef.id, pokeristDocRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  public async getListTable(): Promise<any> {
    try {
      const queryGetById = query(
        collection(this.db, 'table'),
        orderBy('createdTime', 'desc')
      );
      const querySnapshot = await getDocs(queryGetById);
      let listTable: any = [];
      querySnapshot.forEach((doc) => {
        listTable.push({
          ...doc.data(),
          fireStoreId: doc.id,
          createdTime: doc.data()['createdTime'].toDate(),
        });
        return;
      });
      return listTable;
    } catch (error) {
      return 'error';
    }
  }

  public async getDataDetailTable(tableId: string) {
    try {
      debugger;
      const queryGetTableById = doc(this.db, 'table', tableId);

      const tableSnapshot = await getDoc(queryGetTableById);
      const table = tableSnapshot.exists() ? tableSnapshot.data() : null;

      // get player in table
      const queryGetListUser = query(
        collection(this.db, 'pokeristInTable'),
        where('tableId', '==', tableId)
      );
      const playerSnapshot = await getDocs(queryGetListUser);
      const players: any = [];
      debugger;
      playerSnapshot.forEach((doc) => {
        players.push({ ...doc.data(), fireStoreId: doc.id });
      });

      return { table, players };
    } catch (error) {
      return 'error';
    }
  }

  public async subscribePokerist(callback: Function, tableId: string) {
    // get player in table
    const queryGetListUser = query(
      collection(this.db, 'pokeristInTable'),
      where('tableId', '==', tableId)
    );

    return onSnapshot(queryGetListUser, (playerSnapshot) => {
      const players: any = [];
      playerSnapshot.forEach((doc) => {
        players.push({ ...doc.data(), fireStoreId: doc.id });
      });
      callback(players);
    });
  }

  public async loadTru(id: string, quantity: number, balance: number) {
    try {
      const docRef = doc(this.db, 'pokeristInTable', id);
      await updateDoc(docRef, {
        buyInQuantity: quantity,
        balance,
      });
      return 'success';
    } catch (error) {
      return 'error';
    }
  }

  public async payBack(id: string, quantity: number, balance: number) {
    try {
      const docRef = doc(this.db, 'pokeristInTable', id);

      await updateDoc(docRef, {
        returnMoney: quantity,
        balance,
      });
      return 'success';
    } catch (error) {
      return 'error';
    }
  }

  public async joinTable(user: any, tableId: string, buyInUnit: number) {
    if (!user) {
      return 'error';
    }
    try {
      const newItem = {
        userId: user.id,
        userName: user.name,
        buyInQuantity: 1,
        isKey: false,
        returnMoney: 0,
        tableId: tableId,
        balance: -buyInUnit,
      };

      const pokeristDocRef = await addDoc(
        collection(this.db, 'pokeristInTable'),
        newItem
      );

      return { ...newItem, fireStoreId: pokeristDocRef.id };
    } catch (e) {
      return 'error';
    }
  }

  public async themKey(pokeristId: string) {
    if (!pokeristId) {
      return 'error';
    }
    try {
      const pokeristDocRef = doc(this.db, 'pokeristInTable', pokeristId);
      await updateDoc(pokeristDocRef, { isKey: true });
      return 'success';
    } catch (e) {
      return 'error';
    }
  }

  getWeeksInMonth(year: number, month: number) {
    const weeks: any[] = [],
      firstDate = new Date(year, month, 1),
      lastDate = new Date(year, month + 1, 0),
      numDays = lastDate.getDate();

    let dayOfWeekCounter = firstDate.getDay();

    for (let date = 1; date <= numDays; date++) {
      if (dayOfWeekCounter === 0 || weeks.length === 0) {
        weeks.push([]);
      }
      weeks[weeks.length - 1].push(date);
      dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
    }

    return weeks
      .filter((w) => !!w.length)
      .map((w) => ({
        start: w[0],
        end: w[w.length - 1],
        dates: w,
      }));
  }

  public getWeekKeys(createdTime: Date) {
    const tempWeek = this.getWeeksInMonth(
      createdTime.getFullYear(),
      createdTime.getMonth()
    );
    const currentWeekIdx = tempWeek.findIndex(
      (x) => x.start <= createdTime.getDate() && x.end >= createdTime.getDate()
    );

    const currentWeek = tempWeek[currentWeekIdx];

    if (
      currentWeek &&
      currentWeek.start === 1 &&
      currentWeek.dates.length < 7
    ) {
      let obj: any = {
        year: null,
        month: null,
        week: null,
      };
      if (createdTime.getMonth() === 0) {
        obj.year = createdTime.getFullYear() - 1;
        obj.month = 11;
      } else {
        obj.year = createdTime.getFullYear();
        obj.month = createdTime.getMonth() - 1;
      }
      // continue last week
      obj.week = this.getWeeksInMonth(obj.year, obj.month).length - 1;

      return obj.year + 'zzz' + obj.month + 'zzz' + obj.week;
    } else {
      return (
        createdTime.getFullYear() +
        'zzz' +
        createdTime.getMonth() +
        'zzz' +
        currentWeekIdx
      );
    }
  }

  public async chotSo(
    createdTime: Date,
    pokeristFinal: any[],
    tableId: string
  ) {
    try {
      await runTransaction(this.db, async (transaction) => {
        // create or update report
        const weekey = this.getWeekKeys(createdTime);
        const weeklyReportRef = doc(this.db, 'weeklyReport', weekey);
        const weeklyReport = await transaction.get(weeklyReportRef);
        const pokeristObj:any = {}
        for (const item of pokeristFinal) {
          pokeristObj[item.userId] =  {
            userName: item.userName,
            userId: item.userId,
            userFireStoreId: item.fireStoreId,
            balance: item.balance,
          };
        }
        if (!weeklyReport.exists()) {
          // TODO: CREATE NEW REPORT
          await transaction.set(weeklyReportRef, {
            table: [
              {
                tableId: tableId,
                createdTime: createdTime,
                pokerist: pokeristObj,
              },
            ],
          });
        } else {
          // TODO: UPDATE EXISTING REPORT
          const dataWeeklyTable = weeklyReport.data()['table'];
          dataWeeklyTable.unshift({
            tableId: tableId,
            createdTime: createdTime,
            pokerist: pokeristObj,
          });

          await transaction.update(weeklyReportRef, {
            table: dataWeeklyTable
          })
        }
        // TODO: UPDATE TABLE TO END;
        const tableRef = doc(this.db, 'table', tableId);
        await transaction.update(tableRef, {
          isEnd: true,
        });

        // TODO: UPDATE pokerist list after ajust;
        // const batch:any = [];
        const batch = writeBatch(this.db)
        for (const item of pokeristFinal) {
          if(!item.ajusted) {
            continue;
          }
          const itemRef = doc(this.db, 'pokeristInTable', item.fireStoreId);
          batch.update(itemRef, {
            balance: item.balance,
          });
        }

        await batch.commit();
        // const newPopulation = sfDoc.data().population + 1;
        // transaction.update(sfDocRef, { population: newPopulation });
      });
      console.log('Transaction successfully committed!');
      return 'success';
    } catch (e) {
      console.error(e);
      return 'error';
    }
  }
}
