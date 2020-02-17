import db from '../db'

export const model = db.model('User', {
  username: { type: String, },
  email: { type: String, },
  password: { type: String, },
  created: { type: Date, default: Date.now, },
})

export const username_regex = /^[A-Za-z0-9_-]{3,20}$/

export const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const password_regex = /^.{5,}$/
