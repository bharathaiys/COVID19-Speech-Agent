using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ChadBehaviour : MonoBehaviour
{
    Animator animator;
    AudioSource audioSource;
    // Start is called before the first frame update
    void Start()
    {
        this.animator=GetComponent<Animator>();
        this.audioSource=GetComponent<AudioSource>();
        
    }

    // Update is called once per frame
    void Update()
    {
        // if(Input.GetButtonDown("Talk"))
        // {
        //     Debug.Log("Talk button pressed");
        //     byte[] wavBytes = System.Convert.FromBase64String(audioOutput);
        //     AudioClip audioClip = WavUtility. ToAudioClip(wavBytes,0);
        //     this.audioSource.clip = audioClip;
        //     StartCoroutine(this.WaitForEnd(audioClip.length));
            
        // }
         
    }

    public IEnumerator WaitForEnd(AudioClip audioClip)
    {
        this.audioSource.clip = audioClip;
        this.animator.SetBool("talking",true);
        this.audioSource.Play();
        yield return new WaitForSeconds(audioClip.length);
        this.animator.SetBool("talking",false);
        
    }

    public IEnumerator StartNod(AudioClip audioClip)
    {
        
        this.animator.SetBool("nod",true);
        yield return new WaitForSeconds(audioClip.length);
        
    }

    public IEnumerator StopNod(AudioClip audioClip)
    {
        
        this.animator.SetBool("nod",false);
        yield return new WaitForSeconds(audioClip.length);
        
    }
}
