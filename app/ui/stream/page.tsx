"use client"
import { useCompletion } from "@ai-sdk/react"

export default function Page() {
    const {
        completion,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        error,
        stop,
        setInput,
    } = useCompletion({api: "/api/stream"})
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
         {error && <div className="text-red-500 mb-4">{error.message}</div>}
         {isLoading && !completion && <div>Loading...</div>}

        <form 
        onSubmit={(e)=>{
            e.preventDefault()
            setInput("")
            handleSubmit(e)
        }}>
         <div className="flex gap-2">
          <input
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            value={input}
            onChange={handleInputChange}
            placeholder="How can I help you?"
          />
          {isLoading ? (
            <button
              onClick={stop}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Send
            </button>
          )}
        </div>
        </form>
        <div className=" block mt-5 text-lg leading-tight font-medium text-grey">
             {completion && <div className="whitespace-pre-wrap">{completion}</div>}
        </div>
    </div>
  )
}
