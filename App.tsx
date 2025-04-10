import "./shim"
import "./globals"
import React from "react"
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import CredentialsScreen from './screens/CredentialsScreen'
import SettingsScreen from './screens/SettingsScreen'
import { SignifyProvider } from './contexts/SignifyContext'
// import signify, { Serder } from "signify-ts"
// import { assertOperations, resolveOobi, waitOperation } from "./utils"

const Tab = createBottomTabNavigator()

function App(): React.JSX.Element {
  // const isReady = async () => {
  //   try {
  //     const isReady = await signify.ready()

  //     // const bran1 = signify.randomPasscode()
  //     const salt = new signify.Salter({})

  //     console.log("Branch 1 check", salt.qb64)
  //   } catch (error) {
  //     console.log("Error in isReady", error)
  //   }
  // }

  // const setupAllie = async () => {
  //   try {
  //     await signify.ready()
  //     const passcode = signify.randomPasscode()

  //     console.log("Allie Passcode", passcode)

  //     const url = "http://192.168.1.4:3801"

  //     const bootUrl = "http://192.168.1.4:3803"

  //     const allieClient = new signify.SignifyClient(
  //       url,
  //       passcode,
  //       signify.Tier.low,
  //       bootUrl
  //     )

  //     console.log("Allie Client created")

  //     await allieClient.boot()

  //     console.log("Allie Client booted")

  //     await allieClient.connect()

  //     console.log("Allie Client connected")

  //     const allieClientState = await allieClient.state()

  //     console.log(
  //       "Allie Client connected. Client AID:",
  //       allieClientState.controller.state.i,
  //       "Agent AID: ",
  //       allieClientState.agent.i
  //     )

  //     const oobiUrl =
  //       "http://192.168.1.4:5642/oobi/BBilc4-L3tFUnfM_wJr4S4OJanAv_VmF_dJNN6vkf2Ha/controller?name=Wan&tag=witness"
  //     const oobiUrl1 =
  //       "http://192.168.1.4:5643/oobi/BLskRTInXnMxWaGqcpSyMgo0nYbalW99cGZESrz3zapM/controller?name=Wes&tag=witness"
  //     const oobiUrl2 =
  //       "http://192.168.1.4:5644/oobi/BIKKuvBwpmDVA4Ds-EpL5bt9OqPzWPja2LigFYZN2YfX/controller?name=Wil&tag=witness"

  //     const op = await allieClient.oobis().resolve(oobiUrl)

  //     console.log("Resolved OOBI 1", JSON.stringify(op, null, 2))

  //     const op1 = await allieClient.oobis().resolve(oobiUrl1)

  //     console.log("Resolved OOBI 2", JSON.stringify(op1, null, 2))

  //     const op2 = await allieClient.oobis().resolve(oobiUrl2)

  //     console.log("Resolved OOBI 3", JSON.stringify(op2, null, 2))

  //     let icpResult1 = await allieClient.identifiers().create("aid1", {
  //       transferable: true,
  //       wits: [
  //         "BBilc4-L3tFUnfM_wJr4S4OJanAv_VmF_dJNN6vkf2Ha",
  //         "BLskRTInXnMxWaGqcpSyMgo0nYbalW99cGZESrz3zapM",
  //         "BIKKuvBwpmDVA4Ds-EpL5bt9OqPzWPja2LigFYZN2YfX",
  //       ],
  //       toad: 3,
  //       count: 1,
  //       ncount: 1,
  //       isith: "1",
  //       nsith: "1",
  //     })

  //     console.log("Created AID", icpResult1)

  //     const response = await icpResult1.op()
  //     console.log("ICP Response", response)
  //   } catch (error) {
  //     console.log("Error in setupAllie", error)
  //   }
  // }

  // const setupBrett = async () => {
  //   try {
  //     await signify.ready()
  //     const passcode = signify.randomPasscode()

  //     console.log("Brett Passcode", passcode)

  //     const url = "http://192.168.1.4:3701"

  //     const bootUrl = "http://192.168.1.4:3703"

  //     const brettClient = new signify.SignifyClient(
  //       url,
  //       passcode,
  //       signify.Tier.low,
  //       bootUrl
  //     )

  //     console.log("Brett Client created")

  //     await brettClient.boot()

  //     console.log("Brett Client booted")

  //     await brettClient.connect()

  //     console.log("Brett Client connected")

  //     const brettClientState = await brettClient.state()

  //     console.log(
  //       "Brett Client connected. Client AID:",
  //       brettClientState.controller.state.i,
  //       "Agent AID: ",
  //       brettClientState.agent.i
  //     )

  //     const iUrls = [
  //       "http://192.168.1.4:5645/oobi/BM35JN8XeJSEfpxopjn5jr7tAHCE5749f0OobhMLCorE/controller?name=Wit&tag=witness",
  //       "http://192.168.1.4:5646/oobi/BIj15u5V11bkbtAxMA7gcNJZcax-7TgaBMLsQnMHpYHP/controller?name=Wub&tag=witness",
  //       "http://192.168.1.4:5647/oobi/BF2rZTW79z4IXocYRQnjjsOuvFUQv-ptCf8Yltd7PfsM/controller?name=Wyz&tag=witness",
  //     ]

  //     for (let i = 0; i < iUrls.length; i++) {
  //       const op = await brettClient.oobis().resolve(iUrls[i])

  //       console.log("Resolved OOBI", i, JSON.stringify(op, null, 2))
  //     }

  //     let createOp = await (
  //       await brettClient.identifiers().create("aid1", {
  //         transferable: true,
  //         wits: [
  //           "BM35JN8XeJSEfpxopjn5jr7tAHCE5749f0OobhMLCorE",
  //           "BIj15u5V11bkbtAxMA7gcNJZcax-7TgaBMLsQnMHpYHP",
  //           "BF2rZTW79z4IXocYRQnjjsOuvFUQv-ptCf8Yltd7PfsM",
  //         ],
  //         toad: 3,
  //         count: 1,
  //         ncount: 1,
  //         isith: "1",
  //         nsith: "1",
  //       })
  //     ).op()

  //     const op = await waitAndGetDoneOp(brettClient, createOp)

  //     console.log("Operation", op)

  //     const resp = await brettClient.identifiers().get("aid1")

  //     console.log("Identifiers", resp)
  //   } catch (error) {
  //     console.log("Error in setupBrett", error)
  //   }
  // }

  // const fullTest = async () => {
  //   console.log("Starting fullTest")
  //   try {
  //     const url = "http://192.168.110.17:3901"
  //     const bootUrl = "http://192.168.110.17:3903"
  //     console.log("URL", url)
  //     console.log("Boot URL", bootUrl)
  //     await signify.ready()
  //     console.log("Signify ready")
  //     const bran1 = signify.randomPasscode()
  //     const bran2 = signify.randomPasscode()
  //     console.log("Branch 1", bran1)
  //     console.log("Branch 2", bran2)
  //     const client1 = new signify.SignifyClient(
  //       url,
  //       bran1,
  //       signify.Tier.low,
  //       bootUrl
  //     )
  //     console.log("Client 1 created")
  //     const client2 = new signify.SignifyClient(
  //       url,
  //       bran2,
  //       signify.Tier.low,
  //       bootUrl
  //     )
  //     console.log("Client 2 created")
  //     await client1.boot()
  //     await client2.boot()
  //     await client1.connect()
  //     await client2.connect()
  //     console.log("Clients booted and connected")
  //     const state1 = await client1.state()
  //     const state2 = await client2.state()
  //     console.log(
  //       "Client 1 connected. Client AID:",
  //       state1.controller.state.i,
  //       "Agent AID: ",
  //       state1.agent.i
  //     )
  //     console.log(
  //       "Client 2 connected. Client AID:",
  //       state2.controller.state.i,
  //       "Agent AID: ",
  //       state2.agent.i
  //     )

  //     // Generate challenge words
  //     const challenge1_small = await client1.challenges().generate(128)
  //     console.log("CHECK 1", challenge1_small.words.length === 12)
  //     const challenge1_big = await client1.challenges().generate(256)
  //     console.log("CHECK 2", challenge1_big.words.length === 24)

  //     // Create two identifiers, one for each client
  //     const icpResult1 = await client1.identifiers().create("alice", {
  //       toad: 3,
  //       wits: [
  //         "BBilc4-L3tFUnfM_wJr4S4OJanAv_VmF_dJNN6vkf2Ha",
  //         "BLskRTInXnMxWaGqcpSyMgo0nYbalW99cGZESrz3zapM",
  //         "BIKKuvBwpmDVA4Ds-EpL5bt9OqPzWPja2LigFYZN2YfX",
  //       ],
  //     })
  //     const { response: aid1 } = await waitOperation(
  //       client1,
  //       await icpResult1.op()
  //     )
  //     const rpyResult1 = await client1
  //       .identifiers()
  //       .addEndRole("alice", "agent", client1!.agent!.pre)
  //     await waitOperation(client1, await rpyResult1.op())
  //     console.log("Alice's AID:", aid1.i)

  //     const icpResult2 = await client2.identifiers().create("bob", {
  //       toad: 3,
  //       wits: [
  //         "BBilc4-L3tFUnfM_wJr4S4OJanAv_VmF_dJNN6vkf2Ha",
  //         "BLskRTInXnMxWaGqcpSyMgo0nYbalW99cGZESrz3zapM",
  //         "BIKKuvBwpmDVA4Ds-EpL5bt9OqPzWPja2LigFYZN2YfX",
  //       ],
  //     })
  //     const { response: aid2 } = await waitOperation(
  //       client2,
  //       await icpResult2.op()
  //     )
  //     const rpyResult2 = await client2
  //       .identifiers()
  //       .addEndRole("bob", "agent", client2!.agent!.pre)
  //     await waitOperation(client2, await rpyResult2.op())

  //     // Exchenge OOBIs
  //     const oobi1 = await client1.oobis().get("alice", "agent")
  //     const oobi2 = await client2.oobis().get("bob", "agent")

  //     await resolveOobi(client1, oobi2.oobis[0], "bob")
  //     console.log("Client 1 resolved Bob's OOBI")
  //     await resolveOobi(client2, oobi1.oobis[0], "alice")
  //     console.log("Client 2 resolved Alice's OOBI")

  //     // List Client 1 contacts
  //     let contacts1 = await client1.contacts().list()
  //     let bobContact = contacts1.find((contact) => contact.alias === "bob")
  //     console.log("CHECK 3", bobContact?.alias === "bob")
  //     console.log("CHECK 4", bobContact?.challenges?.length === 0)

  //     // Bob responds to Alice challenge
  //     await client2.challenges().respond("bob", aid1.i, challenge1_small.words)
  //     console.log("Bob responded to Alice challenge with signed words")

  //     // Alice verifies Bob's response
  //     const verifyOperation = await waitOperation(
  //       client1,
  //       await client1.challenges().verify(aid2.i, challenge1_small.words)
  //     )
  //     console.log("Alice verified challenge response")

  //     //Alice mark response as accepted
  //     const verifyResponse = verifyOperation.response as {
  //       exn: Record<string, unknown>
  //     }
  //     const exn = new Serder(verifyResponse.exn)

  //     await client1.challenges().responded(aid2.i, exn.ked.d)
  //     console.log("Alice marked challenge response as accepted")

  //     // Check Bob's challenge in conctats
  //     contacts1 = await client1.contacts().list()
  //     bobContact = contacts1.find((contact) => contact.alias === "bob")

  //     console.log("CHECK 5", Array.isArray(bobContact?.challenges))
  //     console.log("CHECK 6", bobContact?.challenges[0].authenticated)

  //     await assertOperations(client1, client2)
  //   } catch (error) {
  //     console.log("Error in fullTest", error)
  //   }
  // }

  return (
    <SignifyProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = 'settings'

              if (route.name === 'Credentials') {
                iconName = focused ? 'id-card' : 'id-card-outline'
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline'
              }

              return <Ionicons name={iconName} size={size} color={color} />
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}
        >
          <Tab.Screen name="Credentials" component={CredentialsScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SignifyProvider>
  )
}

export default App
