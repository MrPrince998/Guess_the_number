## Fetch Data
const name = GetHook([key], "url", "method")

## POST Data
const name = PostHook<interface, {data}>([key], "url", "method")

name.mutate({
  data: {
    // your data here
  }
})