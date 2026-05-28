export const json  = (data, status = 200) => Response.json(data, { status })
export const error = (msg,  status = 400) => Response.json({ error: msg }, { status })
