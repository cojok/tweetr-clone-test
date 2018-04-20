'use strict'

const Schema = use('Schema')

class ReplaySchema extends Schema {
  up () {
    this.create('replays', table => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
      table
        .integer('tweet_id')
        .unsigned()
        .notNullable()
      table.text('replay').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('replays')
  }
}

module.exports = ReplaySchema
