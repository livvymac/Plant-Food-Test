import 'regenerator-runtime/runtime'

export async function submitRepo(id, repoURL) {
    let res;
    let requestData = {"repoURL": repoURL,"secret":"i sometimes code things"};
    console.log("req data", requestData)
    console.log("id", id)
    res = await fetch(`https://tweakplan.com/JavaScriptDemoSubmission-1.0/candidates/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(requestData),
        headers: {
        'Content-type': 'application/json; charset=UTF-8'
        }
    })
    return res;
}

export async function confirmDetails() {
    let res;
    res = await fetch("https://tweakplan.com/JavaScriptDemoSubmission-1.0/candidates?email=livvymac@xtra.co.nz&secret=i sometimes code things");
    return res;
}