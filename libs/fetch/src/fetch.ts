export type RequestHeaders = Record<string, string> | Headers

export type Method =
    'get'
    | 'post'
    | 'put'
    | 'patch'
    | 'delete'
    | 'options'
    | 'head'
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | 'OPTIONS'
    | 'HEAD'
export interface Options {
  // the URL to request
  url?: string
  
  // HTTP method, case-insensitive
  method?: Method

  // Request headers
  headers?: RequestHeaders
  
  // a body, optionally encoded, to send
  body?: FormData | string | object
  
  // An encoding to use for the response
  responseType?: 'text' | 'json' | 'stream' | 'blob' | 'arrayBuffer' | 'formData'

  // querystring parameters
  params?: string | Record<string, string> | URLSearchParams | string[][] | undefined

  // custom function to stringify querystring parameters
  paramsSerializer?: (params: Options['params']) => string

  // Send the request with credentials like cookies
  withCredentials?: boolean

  // Authorization header value to send with the request
  auth?: string

  // Pass an Cross-site Request Forgery prevention cookie value as a header defined by `xsrfHeaderName`
  xsrfCookieName?: string

  // The name of a header to use for passing XSRF cookies
  xsrfHeaderName?: string

  // Override status code handling (default: 200-399 is a success)
  validateStatus?: (status: number) => boolean

  // An array of transformations to apply to the outgoing request
  transformRequest?: Array<(body: object, headers?: RequestHeaders) => object>

  transformResponse?: Array<(data: object) => object>

  // a base URL from which to resolve all URLs
  baseURL?: string

  // Custom window.fetch implementation
  fetch?: typeof window.fetch

  // signal returned by AbortController
  cancelToken?: AbortSignal

  data?: object

  // The mode of the request (e.g., cors, no-cors, same-origin, or navigate.). Defaults to cors.
  mode?: RequestMode

  // The key to cache the response.
  tag?: string

  // Invalidate the cached data for the given tag.
  invalidateTag?: string
}

export interface CustomResponse<T> extends Response {
  config: Options
  data: T
  headers: Headers
  status: number
  statusText: string
  redirect?: boolean
  type: ResponseType
  body: ReadableStream<Uint8Array> | null
  request: RequestInit
}

export type BaseFetchFn = {
  <T>(urlOrConfig: string | Options, config?: Options, _method?: Method, data?: object): Promise<CustomResponse<T>>
  create: (options: Options) => BaseFetchFn
}

const defaultHeaders: RequestHeaders = {
  Accept: 'application/json, text/plain, */*',
  'Content-Type': 'application/json',
}

const defaultOptions: Options = {
  headers: defaultHeaders
}

function deepMerge<T>(opts: T, overrides: object, lowerCase: boolean = false): object {
  let out: object = {}
  
  if (Array.isArray(opts)) {
    return [...opts, overrides]
  }
  
  // eslint-disable-next-line no-restricted-syntax
  for (const [k, v] of Object.entries(opts as never)) {
    const key: string = lowerCase ? k.toLowerCase() : k
    out = {...out, [key]: v}
  }
  
  // eslint-disable-next-line no-restricted-syntax
  for (const [k, v] of Object.entries(overrides)) {
    const key: string = lowerCase ? k.toLowerCase() : k
    out = {
      ...out,
      [key]: 
        (out as never)[key] && typeof v === 'object'
          ? deepMerge((out as never)[key], v, key === 'headers')
          : v
    }
  }
  
  return out
}

function createBaseFetchFn(defaults: Options = defaultOptions): BaseFetchFn {
  const cache: object = {}
  
  async function baseFetchFn<T>(
    urlOrConfig: string | Options,
    config: Options = defaultOptions,
    _method: Method = 'GET',
    data: object | string | undefined = undefined
  ): Promise<CustomResponse<T>> {
    let url: RequestInfo | URL =
      typeof urlOrConfig === 'string'
        ? urlOrConfig as string
        : urlOrConfig.url as string
    
    const response: Partial<CustomResponse<T>> = { config }
    
    // Merge the global config with the default config.
    const options: Options = deepMerge<Options>(defaults, config)
    
    // Perform cached data invalidation
    if (options?.invalidateTag) {
      const tag = (cache as never)[options?.invalidateTag]
      
      // TODO: refetch the api for invalidate tag.
      if (tag) {
        delete (cache as never)[options?.invalidateTag]
      }
    }
    
    // If the response was already cached, then return the cached data.
    if (options.tag && (cache as never)[options?.tag]) {
      return (cache as never)[options.tag]
    }
    
    const customHeaders: RequestHeaders = {}
    
    // Include the auth token into request headers.
    if (options?.auth) {
      customHeaders.Authorization = `Bearer ${options.auth}`
    }
    
    if (options?.baseURL) {
      url = url?.replace(/^(?!.*\/\/)\/?/, `${options.baseURL  }/`)
    }
    
    if (options?.params) {
      url +=
        // eslint-disable-next-line no-bitwise
        (~url?.indexOf('?') === 0 ? '?' : '&') +
        (options?.paramsSerializer?.(options.params) ?? new URLSearchParams(options.params))
    }
    
    response.config = options
    
    const request: RequestInit = {
      method: (options.method || _method).toUpperCase(),
      body: JSON.stringify(data),
      headers: deepMerge<RequestHeaders | undefined>(options.headers, customHeaders, true) as HeadersInit
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return fetch(url, request).then((res: any) => {
      if (options.responseType === 'stream') {
        response.data = res.body
        return response
      }
      
      response.status = res.status
      response.statusText = res.statusText
      response.headers = request.headers as Headers
      response.request = request
      
      return res[options.responseType ?? 'text']()
        // eslint-disable-next-line @typescript-eslint/no-shadow
        .then((data: any): void => {
          response.data = JSON.parse(data)
        })
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        .catch((): void => { throw response })
        .then(async (): Promise<Partial<CustomResponse<T>>> => {
          const ok = res.ok
          
          if (options.tag) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (cache as any)[options.tag] = response
          }
          
          return ok ? response : Promise.reject(response)
        })
    })
  }
  
  baseFetchFn.create = createBaseFetchFn
  
  return baseFetchFn
}

export const baseFetch: BaseFetchFn = createBaseFetchFn()
