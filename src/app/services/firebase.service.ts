import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  addDoc, collection, doc,
  getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, runTransaction, updateDoc, where, writeBatch
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import AppConstant from '../constants/app.constant';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  public readonly firebaseConfig = environment.firebaseConfig;

  // Initialize Firebase
  public app = initializeApp(this.firebaseConfig);
  public db = getFirestore();
  constructor() { }

  public async getListUser() {
    const querySnapshot = await getDocs(collection(this.db, 'users'));
    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${doc.data()}`);
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
      // console.log('--------', user);
      return user;
    } catch (error) {
      return 'error';
    }
  }

  public async addUser(user: any) {
    if (!user) {
      return 'error';
    }
    try {
      const docRef = await addDoc(collection(this.db, 'users'), {
        ...user,
        role: AppConstant.Roles.user,
      });

      // console.log('Document written with ID: ', docRef.id);
      return docRef.id;
    } catch (e) {
      // console.error('Error adding document: ', e);
      return 'error';
    }
  }

  public async multipleJoinTables(users: string[], tableId: string, buyInUnit: number) {
    const batch = writeBatch(this.db);
    if (!users || !users.length) {
      return 'error';
    }
    try {
      for (const user of users) {
        if (!user) {
          return 'error';
        }

        const newItem = {
          userId: user,
          userName: user,
          buyInQuantity: 1,
          isKey: false,
          returnMoney: 0,
          tableId: tableId,
          balance: -buyInUnit,
        };

        // Set the value of 'NYC'
        const pokeristDocRef = doc(this.db, "pokeristInTable", user + Date.now());
        batch.set(pokeristDocRef, newItem);
      }

      // console.log('Document written with ID: ', docRef.id);
      return batch.commit();
    } catch (e) {
      return 'error';
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
      // console.log('Document written with ID: ', docRef.id, pokeristDocRef.id);
    } catch (e) {
      // console.error('Error adding document: ', e);
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

    return onSnapshot(queryGetListUser, (userSnapshot) => {
      const users: any = [];
      userSnapshot.forEach((doc) => {
        users.push({ ...doc.data(), fireStoreId: doc.id });
      });
      callback(users);
    });
  }

  public async subscribeAllUser(callback: Function,) {
    // get player in table
    const queryGetListUser = query(
      collection(this.db, 'users'),
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

        if (!weeklyReport.exists()) {
          const newPokeristObj: any = {};
          for (const item of pokeristFinal) {
            newPokeristObj[item.userId] = {
              userName: item.userName,
              userId: item.userId,
              userFireStoreId: item.fireStoreId,
              tables: {
                [tableId]: {
                  createdTime: createdTime,
                  balance: item.balance,
                },
              },
            };
          }
          // TODO: CREATE NEW REPORT
          await transaction.set(weeklyReportRef, {
            pokerist: newPokeristObj,
            createdTime: new Date(),
            tables: [
              {
                id: tableId,
                reatedTime: createdTime,
              },
            ],
          });
        } else {
          // TODO: UPDATE EXISTING REPORT
          // existing pokerist
          const DataWeekly = weeklyReport.data();
          const dataWeeklyPokerist = DataWeekly['pokerist'];
          const reportListTable = DataWeekly['tables'];
          const pokeristInReportKeys = Object.keys(dataWeeklyPokerist);

          const newPokeristObj: any = {
            ...JSON.parse(JSON.stringify(dataWeeklyPokerist)),
          };

          // create new pokerist report
          for (const item of pokeristFinal) {
            const tableHistoryForUser =
              dataWeeklyPokerist[item.userId]?.tables || {};
            newPokeristObj[item.userId] = {
              userName: item.userName,
              userId: item.userId,
              userFireStoreId: item.fireStoreId,
              tables: {
                ...tableHistoryForUser,
                [tableId]: {
                  createdTime: createdTime,
                  balance: item.balance,
                },
              },
            };
          }

          // add existing pokerist played and not in list above

          // for (const key of pokeristInReportKeys) {
          //   const item = dataWeeklyPokerist[key];
          //   item.tables[tableId] = {
          //     createdTime: createdTime,
          //     balance: newPokeristObj[key]?.tables[tableId]?.balance || 0,
          //   };
          // }

          // for (const key of Object.keys(newPokeristObj)) {
          //   if (!pokeristInReportKeys.includes(key)) {
          //     dataWeeklyPokerist[key] = {
          //       ...JSON.parse(JSON.stringify(newPokeristObj[key])),
          //     };
          //   }
          // }

          reportListTable.push({
            id: tableId,
            reatedTime: createdTime,
          });

          await transaction.update(weeklyReportRef, {
            pokerist: newPokeristObj,
            tables: reportListTable,
          });
        }
        // TODO: UPDATE TABLE TO END;
        const tableRef = doc(this.db, 'table', tableId);
        await transaction.update(tableRef, {
          isEnd: true,
        });

        // TODO: UPDATE pokerist list after ajust;
        // const batch:any = [];
        const batch = writeBatch(this.db);
        for (const item of pokeristFinal) {
          if (!item.ajusted) {
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
      // console.log('Transaction successfully committed!');
      return 'success';
    } catch (e) {
      // console.error(e);
      return 'error';
    }
  }

  async getListReports() {
    try {
      const queryGetById = query(
        collection(this.db, 'weeklyReport'),
        orderBy('createdTime', 'desc')
      );
      const querySnapshot = await getDocs(queryGetById);
      let listReport: any = [];
      querySnapshot.forEach((doc) => {
        const [year, month, week] = doc.id.split('zzz');
        listReport.push({
          fireStoreId: doc.id,
          name: `Tuần ${Number(week) + 1} Tháng ${Number(month) + 1} Năm ${year}`,
        });
        return;
      });
      return listReport;
    } catch (error) {
      return 'error';
    }
  }

  async getTopPlayerAllTheTime() {
    try {
      const queryGetById = query(
        collection(this.db, 'weeklyReport'),
        orderBy('createdTime', 'desc')
      );
      
      const querySnapshot = await getDocs(queryGetById);
      let listItem: any = {};
      querySnapshot.forEach((doc) => {
        if (doc.data()['pokerist']) {
          let weekRecord = doc.data()['pokerist'];
          const listPokerist = Object.keys(weekRecord);
          for (const iterator of listPokerist) {
            const tablesKeys = Object.keys(weekRecord[iterator]['tables']);
            tablesKeys.forEach(tableKey => {
              const tableItem = weekRecord[iterator]['tables'][tableKey];
              if (listItem[iterator]) {
                listItem[iterator].totalQuantity = listItem[iterator].totalQuantity + (tableItem?.balance || 0);
              } else {
                listItem[iterator] = { totalQuantity: tableItem?.balance || 0 };
              }
            });


          }
        }
      });

      return listItem;
    } catch (error) {
      return 'error';
    }
  }

  async getReportDetail(id: string | null) {
    if (!id) {
      return 'error';
    }

    try {
      const queryGetTableById = doc(this.db, 'weeklyReport', id);

      const snapshot = await getDoc(queryGetTableById);

      return snapshot.data();
    } catch (error) {
      return 'error'
    }
  }

  async bankedPokerist(pokeristId: any, reportId: string) {
    if (!reportId || !pokeristId) {
      return 'error';
    }

    // const pokeristNew = JSON.parse(JSON.stringify(pokerist)); 

    try {
      const docref = doc(this.db, 'weeklyReport', reportId);

      const snapshot = await getDoc(docref);

      if (snapshot.exists()) {
        const newAllPokerist = snapshot.data()['pokerist'];
        newAllPokerist[pokeristId]['isBanked'] = true;
        await updateDoc(docref, {
          pokerist: newAllPokerist,
        });

        return 'success';
      }
      else {
        return 'error';
      }

    } catch (error) {
      return 'error'
    }
  }
}
