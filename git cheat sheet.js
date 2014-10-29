GITHUB GUMMA CHEAT SHEET

- git status

	Skipuninnn se þið eigið að nauðga, segjir til um 
		-Á hvaða branchi þið eruð
		-Hvaða filea þið hafið edit-að
		-og eitthvað fleirra

-git add [file]

	Skipunnin sem segjir git að fylgjast með þessum file

-git add .

	Skipunninn sem segjir git að fylgjast með öllum fileum (sem birtast rauðir í git status)

-git commit -m "[message]"
	
	Segjir að þetta sem þið hafið addað sé tilbúið (tekur snapshit sem er vistað í history skýrist síðar)

-git branch

	Listi af öllum local brranches

-git branch [branch name]
	nýtt branch

-git checkout [branch name]
	Skipta yfir á annað branch

-git push
	ýtta öllu sem þið hafið gert á branchið

-git pull
	nærð í allar breytingar á því branchi sem þú ert á (frá öðrum t.d)


þetta er svona helstu það er heeeelling meira


Tökum dæmi ég ætla að búa til highscore system.

ég byrja á orign/master branch (sem við byrjum allir á)

1.Skrifa "git status" (hvar er ég?)
	git status
= Fæ að ég er á origin/master

2.Skrifa "git pull" (er ég örugglega með allt sem hefur veirð gert)
	git pull
= næ í breytingar ef hafa orðið

3.Skrifa "git branch gummi-highscore" og þá bý ég til nýtt branch sem heitir gummi-highscore
	git branch gummi-highscore
= nýtt branch hefur verið búið til

4. Skrifa "git checkout gummi-highscore"
	git checkout gummi-highscore
= Nú er ég á branchinu gummi-highscore

5.Skrifa "git status"
	git status
= Sé að ég er á gummi-highscore

(nú geri ég helling af stöffi og gummi-highscore er tilbúið)

6.geri "git status"
	git status
= Sé breytingar sem ég hef gert

7. geri "git add ."
	git add .
= bætti við öllum breytngnum mínum(hér hefði ég kannski að handvirkt adda hlutum sem ég lagaði "git add bla.js" t.d)

8. commita
	git commit -m "Gerði highscore"
= hef sagt git að þetta eru filear sem ég vill að fari áfram

9. tjekka á stöðunni aftur
	git status
= Sé hvaða fæla ég er að fara að bæta við

10. pusha á branchið
	git push / git push gummi-highscore
= bæti við breytingnum mínum á gummi-highscore


Nú ef eitthver annar fer á gummi-highscore branchið þá mun hann fá forritið í NÁKVÆMLEGA SÖMU STÖÐU OG það er hjá mér!

síðan er merge en við gerum það saman bara!
