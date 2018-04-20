'use strict'

const Schema = use('Schema')

class ReplaySchema extends Schema {
  up () {
    this.create('replays', table => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .notNullabel()
      table
        .integer('tweet_id')
        .unsigned()
        .notNullabel()
      table.text('replay').notNullabel()
      table.timestamps()
    })
  }

  down () {
    this.drop('replays')
  }
}

module.exports = ReplaySchema
