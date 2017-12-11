trading = require 'trading'
talib = require 'talib'

params = require 'params'
# what params are needed?

# FEES
_maximumExchangeFee = params.add "Maximum exchange fee %", .25

# Position Sizing
_percentRiskPerUnit = params.add "Equity % risk per unit", 1

# S1 System Params
_periodsForS1EntryBreakout = params.add "S1 entry breakout", 20
_periodsForS1EntryBreakout = params.add "S1 exit counter-breakout", 10

# S2 System Params
_periodsForS2EntryBreakout = params.add "S2 entry breakout", 55
_periodsForS2EntryBreakout = params.add "S2 exit counter-breakout", 20

# UNIT LIMITS
SINGLE_MARKET_UNIT_LIMIT = 4
CLOSELY_RELATED_MARKET_UNIT_LIMIT = 6
LOOSELY_RELATED_MARKET_UNIT_LIMIT = 10
UNIT_LIMIT_DIRECTION = 12


# what constants in the application
ACCOUNT_RISK_PERCENT_PER_UNIT = 1

# context for each calculation
# N volatility


# what needs to be persisted in storage, limit of 64kb

# what does the program need to do at startup
# includes (context, storage)
init: ->
  # set the trading balance

handle: ->
  # what should happen on each tick
  instrument = @data.instruments[0]
  @context.N ?= instrument.atr(_periodsForS1EntryBreakout)
  debug "#{@context.N}"
# includes (context, storage)
