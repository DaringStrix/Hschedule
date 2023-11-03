import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User as MyUser } from '../models/user.model';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, onAuthStateChanged, NextOrObserver, User } from 'firebase/auth';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, query, getDocs, updateDoc, deleteDoc } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  auth = inject(AngularFireAuth)
  firestore = inject(AngularFirestore)

  signIn(user: MyUser) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  signUp(user: MyUser) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  singOut() {
    return getAuth().signOut()
  }

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  // ----------------------------Database-------------------------

  // ----------------------------users-------------------------

  async setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data)
  }

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data()
  }

  sendReoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email)
  }

  async getAuth(nextOrObserver: NextOrObserver<User>) {
    return onAuthStateChanged(getAuth(), nextOrObserver)
  }

  // ----------------------------horarios-------------------------

  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data)
  }
  async duplicateDocument(path: string, uid: string) {

    const data = await this.getDocument(path + `/${uid}`)
    addDoc(collection(getFirestore(), path), data).then(async res => {
      const query = this.getDocs(path + `/${uid}/horas`);
      (await query).forEach(async each => {
        const data = await this.getDocument(path + `/${uid}/horas/${each.id}`)
        addDoc(collection(getFirestore(), path + `/${res.id}/horas`), data).then(async innerRes => {
          const query = this.getDocs(path + `/${uid}/horas/${each.id}/tareas`);
          (await query).forEach(async innerEach => {
            const data = await this.getDocument(path + `/${uid}/horas/${each.id}/tareas/${innerEach.id}`)
            addDoc(collection(getFirestore(), path + `/${res.id}/horas/${innerRes.id}/tareas`), data)
          })
        })
      })
    })
  }

  async deleteDocument(path: string) {
    (await this.getDocs(path + '/horas')).forEach(res => {
      deleteDoc(doc(getFirestore(), path + `/horas/${res['uid']}`))
    })
    await deleteDoc(doc(getFirestore(), path))
  }

  async getDocs(path: string) {
    return await getDocs(query(collection(getFirestore(), path)))
  }

  async updateDoc(path: string, data: {}) {
    await updateDoc(doc(getFirestore(), path), data)
  }

}
