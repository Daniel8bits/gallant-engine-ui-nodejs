

/*

var xhr = new XMLHttpRequest();
xhr.open("GET", "/bar/foo.txt", true);
xhr.onload = function (e) {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    } else {
      console.error(xhr.statusText);
    }
  }
};
xhr.onerror = function (e) {
  console.error(xhr.statusText);
};
xhr.send(null); 


*/

class FileUtils {

    public static load(
        pathname: string, 
        onSuccess: (file: any) => void, 
        onError: (err: string) => void
        ) : void {

        const xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('GET', pathname, false);

        xmlHttpRequest.onload = () => onSuccess(xmlHttpRequest.responseText);
        xmlHttpRequest.onerror = () => onError(xmlHttpRequest.statusText);

        xmlHttpRequest.send(null);

    }

    public static async loadAsync(pathname: string) : Promise<string> {
        let reader : ReadableStreamDefaultReader<Uint8Array>;

        await fetch(pathname)
        .then(res => res.body)
        .then(async body => {
            reader = body.getReader()
        })

        return reader.read()
            .then((stream) => new TextDecoder().decode(stream.value))
    }
}

export default FileUtils;