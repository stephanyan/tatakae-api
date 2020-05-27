import * as game_constants from '../constants/game'

function fill_ground(type, size) {
  return Array(size * size).fill(type)
}

function fill_items(size) {
  return Array(size * size).fill([])
}

function generate_obstacle(size) {
  let obstacle_counter = 0
  const tiles = []
  for (let i = 0; i < size * size; i++) {
    if (obstacle_counter < game_constants.MAX_OBSTACLE && Math.floor(Math.random() * Math.floor(3)) === 2) {
      tiles.push(game_constants.SELECTABLE_OBSTACLE[Math.floor(Math.random() * Math.floor(game_constants.SELECTABLE_OBSTACLE.length))])
      obstacle_counter++
    } else {
      tiles.push(null)
    }
  }
  return tiles
}

function fill_addresses(size) {
  const tiles = []
  for (let i = size - 1; i >= 0; i--) {
    for (let j = 0; j < size; j++) {
      tiles.push({ x: i, y: j })
    }
  }
  return tiles
}

/**
 *
 */
function return_available_position_on_edge(edge, map) {
  switch (edge) {
    case 'up':
      break

    case 'right':
      break

    case 'down':
      break

    case 'left':
      break

    default:
      return { x: 0, y: 0 }
  }
}

const instantiate_empty_fields = (size, type) => {
  const layers = {}
  for (const field of game_constants.LAYERS) {
    layers[field] = Array(size * size).fill(null)
  }

  layers.ground = fill_ground(type, size)
  layers.obstacles = generate_obstacle(size)
  layers.addresses = fill_addresses(size)
  layers.items = fill_items(size)


  return layers
}

const generate_field = () => {

  const field_type = game_constants.SELECTABLE_TILES[Math.floor(Math.random() * game_constants.SELECTABLE_TILES.length)]
  const field_size = game_constants.SELECTABLE_SIZE[Math.floor(Math.random() * game_constants.SELECTABLE_SIZE.length)]

  return instantiate_empty_fields(field_size, field_type)
}


const sanitize_game_info = (user, robot, opponent, opponent_robot, field) => {
  return {
    opponent: {
      name: opponent ? opponent.username : 'dummy',
      robot: {
        hp: opponent_robot.hp,
        modele: opponent_robot.modele,
        battery: opponent_robot.battery,
      },
    },
    player: {
      name: user.username,
      robot: {
        hp: robot.hp,
        modele: robot.modele,
        battery: robot.battery
      },
    },
    field,
  }
}


const encapsulate_user_code = (code, robot, opponent_robot) => {

  const user_robot_string = JSON.stringify(robot)
  const opponent_robot_tring = JSON.stringify(opponent_robot)
  const robot_affectation = `const robot = Robot.from_instance(JSON.parse('${user_robot_string}'));`
  const opponent_robot_affectation = `const enemy_robot = Robot.from_instance(JSON.parse('${opponent_robot_tring}'));`
  const code_starter = `while (robot.battery > 0 && robot.hp > 0 && robot.isRunning) {\n`
  const code_ender = `\n}`
  const returner = `if(robot.onTest) {
    console.log(JSON.stringify(robot.class_tests));
  } else {
    console.log(JSON.stringify(robot.round_movements));
  }`

  return robot_affectation + opponent_robot_affectation + code_starter + code + code_ender + returner

}

function reupdate_memory_map(robot, action) {
  for (const tile_to_update of action.tiles_checked) {
    robot.memory_map[robot.map.get_index_by_address(tile_to_update.addresses.x, tile_to_update.addresses.y)] = tile_to_update
  }
}

function resolve_action(action, robot) {
  const name = action.name

  switch (name) {
    case 'walk':
      robot.position = action.new_position
      reupdate_memory_map(robot, action)
      break

    case 'jump':
      robot.position = action.new_position
      resolve_events(action.events, robot.map)
      break

    case 'check':
      reupdate_memory_map(robot, action)
      break

    case 'hit':
      resolve_events(action.events, robot.map)
      break

    case 'get-hit':
      robot.hp -= action.damage
      break

    case 'die':
      robot.status = "dead"
      resolve_events(action.events, robot.map)
      break

    case 'turn-left':
      robot.orientation = action.new_orientation
      break

    case 'turn-right':
      robot.orientation = action.new_orientation
      break

    default:
      break
  }
}

function resolve_events(events, map) {
  for (const event of events) {
    switch (event.name) {
      case 'bumped':
        break

      case 'destroy':
        map.layers.obstacles[map.get_index_by_address(event.address.x, event.address.y)] = null
        break


      case 'lay-scraps':
        map.layers.items[map.get_index_by_address(event.address.x, event.address.y)].push('scraps')
        break

    }
  }
}

const update_robot = (round, robot, opponent_robot) => {
  for (const action of round.actions) {
    if (action.robot_id === robot.robot_id) {
      resolve_action(action, robot)
    } else {
      resolve_action(action, opponent_robot)
    }

    if (action.name === 'die') {
      return
    }
  }
}

const end_game = (socket, robot, opponent_robot, user, opponent) => {

}

const sanitize_round_info = (user_round, opponent_round) => {

}

const resetRobots = (robot, opponent_robot) => {
  robot.battery = robot.models[robot.model].battery
  opponent_robot = opponent_robot.models[opponent_robot.model].battery
}

const randomize_initial_robot_position = (robot, enemy_robot, map) => {

}



export {
  generate_field,
  sanitize_game_info,
  encapsulate_user_code,
  update_robot,
  end_game,
  sanitize_round_info,
  resetRobots,
  randomize_initial_robot_position,
}